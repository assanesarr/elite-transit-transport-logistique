"use client";
import FooterUser from "./user-footer";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconLoader,
    IconFileText,
    IconTrash,
    IconSortAscending,
    IconSortDescending,
    IconArrowsSort,
    IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useId, useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, isDossierSolde } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, useReactTable, getSortedRowModel } from "@tanstack/react-table";
import { entreprise } from '@/app/data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useClientsStore } from "@/store/clientStore";

import { ExportTableClientPDF } from "@/components/pdf-components/export-clients";
import { GenerateClientReport } from "@/components/pdf-components/raport-client";
import { deleteClient } from "@/lib/actions";
import { toast } from "sonner";
import { useAlertStore } from "@/store/alertStore";
import { generateSimpleClientListDynamic } from "@/components/pdf-components/ExportClientList";
import { UserAvatar } from "./user-avatar";
import { useSearchParams, useRouter } from "next/navigation";

export type User = {
    id: string;
    name: string;
    role: string;
    address: string;
    phone: string;
    email: string;
    avatar: string;
    dossiers: any[];
};

// Fonctions utilitaires pour les calculs
const getTotalMontant = (dossiers: any[]) => {
    return dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total || 0), 0);
};

const getTotalVersement = (dossiers: any[]) => {
    return dossiers
        .flatMap((d: any) => d.versement || [])
        .reduce((sum: number, v: any) => Number(sum) + Number(v.montant || 0), 0);
};

const getStatus = (dossiers: any[]) => {
    const totalMontant = getTotalMontant(dossiers);
    const totalVersement = getTotalVersement(dossiers);
    const result = totalMontant - totalVersement;

    if (totalMontant === 0 && totalVersement === 0) return "nouveau";
    return result <= 0 ? "paye" : "encours";
};

// Vérifier si un client est nouveau
const isNewClient = (dossiers: any[]) => {
    const totalMontant = getTotalMontant(dossiers);
    const totalVersement = getTotalVersement(dossiers);
    return totalMontant === 0 && totalVersement === 0;
};

// Composant d'en-tête de colonne avec tri
const SortableHeader = ({ column, title }: { column: any; title: string }) => {
    const sortDirection = column.getIsSorted();

    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sortDirection === "asc")}
            className="flex items-center gap-2 hover:bg-transparent p-0 font-semibold"
        >
            {title}
            {sortDirection === "asc" ? (
                <IconSortAscending className="h-4 w-4" />
            ) : sortDirection === "desc" ? (
                <IconSortDescending className="h-4 w-4" />
            ) : (
                <IconArrowsSort className="h-4 w-4 opacity-50" />
            )}
        </Button>
    );
};

export default function CardUser() {
    const clients = useClientsStore((state) => state.clients)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }])
    const openAlert = useAlertStore(s => s.open)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientIdParam = searchParams.get('client');
    
    // Filtrer les clients en fonction du paramètre URL
    const [filteredClients, setFilteredClients] = useState(clients);
    
    useEffect(() => {
        if (clientIdParam) {
            const filtered = clients.filter(client => client.id === clientIdParam);
            setFilteredClients(filtered);
            
            // Optionnel: Afficher un message si le client n'existe pas
            if (filtered.length === 0 && clients.length > 0) {
                toast.error(`Client avec l'ID "${clientIdParam}" non trouvé`);
            }
        } else {
            setFilteredClients(clients);
        }
    }, [clients, clientIdParam]);
    
    // Réinitialiser la pagination quand le filtre change
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [clientIdParam]);
    
    // Réinitialiser le filtre (retirer le paramètre URL)
    const resetFilter = () => {
        router.push(window.location.pathname);
        setFilteredClients(clients);
    };

    const destr = async (u: User) => {
        const hasUnsoldDossiers = (dossiers: any[]): boolean => {
            return dossiers.some(dossier => !isDossierSolde(dossier));
        };

        if (hasUnsoldDossiers(u.dossiers)) {
            return toast.error("❌ Suppression refusée : dossiers non soldés présents");
        }

        const rs = await openAlert({ message: `Supprimer ${u.name}` })
        if (!rs) return

        const result = await deleteClient(u.id);

        if (result.success) {
            toast.success("Client supprimé avec succès !");
        } else {
            toast.error("Échec de la suppression du client. Veuillez réessayer SVP.");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => <SortableHeader column={column} title="Client & Dossiers" />,
            cell: ({ row }) => {
                const isNew = isNewClient(row.original.dossiers);

                if (isNew) {
                    return null;
                }

                return (
                    <div className="flex items-center justify-between w-full">
                        <FooterUser user={row.original} />
                    </div>
                )
            }
        },
        {
            id: "status",
            accessorFn: (row) => getStatus(row.dossiers),
            header: ({ column }) => <SortableHeader column={column} title="Statut" />,
            cell: ({ row }) => {
                const isNew = isNewClient(row.original.dossiers);

                if (isNew) {
                    return null;
                }

                const totalMontant = getTotalMontant(row.original.dossiers);
                const totalVersement = getTotalVersement(row.original.dossiers);
                const result = totalMontant - totalVersement

                return (
                    <Badge variant="outline" className={cn(
                        "gap-1",
                        result <= 0
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                    )}>
                        {result <= 0 ? (
                            <>
                                <IconCircleCheckFilled className="h-3 w-3 fill-green-500 dark:fill-green-400" />
                                PAYÉ
                            </>
                        ) : (
                            <>
                                <IconLoader className="h-3 w-3 animate-spin" />
                                En cours
                            </>
                        )}
                    </Badge>
                )
            }
        },
        {
            id: "netpaye",
            accessorFn: (row) => getTotalMontant(row.dossiers),
            header: ({ column }) => <SortableHeader column={column} title="Facturé" />,
            cell: ({ row }) => {
                const isNew = isNewClient(row.original.dossiers);

                if (isNew) {
                    return null;
                }

                const totalMontant = getTotalMontant(row.original.dossiers);
                return (
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat("fr-FR").format(totalMontant)} FCFA
                    </span>
                )
            },
        },
        {
            id: "versement",
            accessorFn: (row) => getTotalVersement(row.dossiers),
            header: ({ column }) => <SortableHeader column={column} title="Encaissé" />,
            cell: ({ row }) => {
                const isNew = isNewClient(row.original.dossiers);

                if (isNew) {
                    return null;
                }

                const total = getTotalVersement(row.original.dossiers);
                return (
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat("fr-FR").format(total)} FCFA
                    </span>
                )
            },
        },
        {
            id: "restant",
            accessorFn: (row) => {
                const totalMontant = getTotalMontant(row.dossiers);
                const totalVersement = getTotalVersement(row.dossiers);
                return totalMontant - totalVersement;
            },
            header: ({ column }) => <SortableHeader column={column} title="Reste" />,
            cell: ({ row }) => {
                const isNew = isNewClient(row.original.dossiers);

                if (isNew) {
                    return null;
                }

                const totalMontant = getTotalMontant(row.original.dossiers);
                const totalVersement = getTotalVersement(row.original.dossiers);
                const result = totalMontant - totalVersement

                return (
                    <span className={cn(
                        "font-bold",
                        result > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    )}>
                        {result > 0 ? new Intl.NumberFormat("fr-FR").format(result) + " FCFA" : "Soldé"}
                    </span>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const isNew = isNewClient(row.original.dossiers);

                if (isNew) {
                    return null;
                }

                return (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost"
                            size="icon"
                            className="p-1.5 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors group relative"
                            onClick={() => GenerateClientReport(row.original, entreprise)}
                        >
                            <IconFileText className="h-4 w-4" />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Imprimer
                            </span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => destr(row.original)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors group relative">
                            <IconTrash />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Supprimer {row.original.name}
                            </span>
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: filteredClients,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    // Style spécial pour les lignes des nouveaux clients
    const getRowClassName = (row: any) => {
        const isNew = isNewClient(row.original.dossiers);
        return cn(
            "transition-colors relative",
            isNew && "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/20"
        );
    };

    // Rendu personnalisé pour les lignes des nouveaux clients
    const renderRow = (row: any) => {
        const isNew = isNewClient(row.original.dossiers);

        if (isNew) {
            return (
                <TableRow
                    key={row.id}
                    className={getRowClassName(row)}
                >
                    <TableCell colSpan={columns.length} className="text-center cursor-not-allowed">
                        <UserAvatar
                            name={row.original.name}
                            avatar={row.original.avatar}
                        />
                    </TableCell>
                </TableRow>
            );
        }

        return (
            <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
                {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
        );
    };

    // Trouver le client filtré pour afficher son nom
    const filteredClient = clientIdParam && filteredClients.length === 1 ? filteredClients[0] : null;

    return (
        <div className="p-4 w-full space-y-4">
            {/* Bannière d'information si un filtre est actif */}
            {clientIdParam && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <span>🔍</span>
                        <span>Affichage du client sélectionné</span>
                        {filteredClient && (
                            <span className="font-semibold">: {filteredClient.name}</span>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilter}
                        className="bg-white dark:bg-gray-800 gap-1"
                    >
                        <IconX className="h-3 w-3" />
                        Afficher tous les clients
                    </Button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
                <Input
                    placeholder="Rechercher par nom..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    disabled={!!clientIdParam}
                />

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        className="gap-2 bg-linear-to-r font-bold text-white bg-green-700 hover:bg-green-600 hover:text-slate-50 border-0"
                        onClick={() => generateSimpleClientListDynamic(filteredClients, entreprise)}
                    >
                        <IconFileText className="h-4 w-4" />
                        Export Clients PDF
                    </Button>
                    <Button
                        className="ml-auto gap-2 bg-linear-to-r font-bold text-white bg-slate-700 hover:bg-slate-600 hover:text-slate-50 border-0"
                        onClick={() => ExportTableClientPDF(filteredClients, entreprise)}
                    >
                        <IconFileText className="h-4 w-4" />
                        Rapport Clients PDF
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border shadow-sm w-full">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-semibold">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => renderRow(row))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {clientIdParam 
                                        ? `Aucun client trouvé avec l'ID "${clientIdParam}"`
                                        : "Aucun résultat trouvé."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination - cachée si filtre URL actif et un seul client */}
            {(!clientIdParam || filteredClients.length > 1) && (
                <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4 p-2">
                    <div className="text-sm text-gray-500">
                        Affichage de {table.getRowModel().rows.length} sur {filteredClients.length} clients
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Première page</span>
                                <IconChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Page précédente</span>
                                <IconChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Page suivante</span>
                                <IconChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Dernière page</span>
                                <IconChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}