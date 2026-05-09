"use client"

import FooterUser from "./user-footer";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconLoader,
    IconPencil,
    IconFileText,
    IconFolder,
    IconFolderOpen,
    IconFileDescription
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import TrashComponent from "./trash";
import { useId, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, generateFileName } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useClientsStore } from "@/store/clientStore";

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

// Composant pour l'avatar avec les initiales
export const UserAvatar = ({ name, avatar, dossiersCount }: { name: string; avatar: string; dossiersCount: number }) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-slate-200 dark:ring-slate-700 transition-all hover:ring-slate-400">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="bg-linear-to-br from-slate-500 to-slate-600 text-white text-sm">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>

                {/* Badge pour le nombre de dossiers sur l'avatar */}
                {dossiersCount > 0 && (
                    <div className="absolute -bottom-1 -right-1">
                        <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-bold shadow-sm border-2 border-white dark:border-gray-800">
                            {dossiersCount}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                    <IconFolderOpen className="h-3 w-3" />
                    <span>{dossiersCount} dossier{dossiersCount > 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
};

// Composant pour le compteur de dossiers stylisé
const DossiersCounter = ({ count }: { count: number }) => {
    if (count === 0) return null;

    return (
        <div className="flex items-center gap-1.5">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${count > 5
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    : count > 2
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                <IconFileDescription className={`h-3 w-3 ${count > 5 ? 'text-orange-500' : 'text-blue-500'
                    }`} />
                <span className="font-semibold">{count}</span>
                <span className="hidden sm:inline">dossier{count > 1 ? 's' : ''}</span>
            </div>
        </div>
    );
};

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function CardUser() {
    const clients = useClientsStore((state) => state.clients)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // Calcul des statistiques globales

    const stats = useMemo(() => {
        const totalClients = clients.length;
        const totalDossiers = clients.reduce((sum, client) => sum + client.dossiers.length, 0);
        const totalMontant = clients.reduce((sum, client) =>
            sum + client.dossiers.reduce((s, d) => s + Number(d.montant_total || 0), 0), 0);

        return { totalClients, totalDossiers, totalMontant };
    }, [clients]);
    const exportTablePDF = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const PRIMARY = "#2a6dd9";
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const marginX = 15;
        const headerH = 26;
        const footerH = 12;

        function enTete() {
            doc.setDrawColor(PRIMARY);
            doc.setLineWidth(0.6);
            doc.line(marginX, headerH, pageW - marginX, headerH);

            doc.setFillColor(PRIMARY);
            doc.roundedRect(marginX, 7, 13, 13, 2, 2, "F");
            doc.setTextColor("#ffffff");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("E", marginX + 6.5, 15.5, { align: "center" });

            doc.setTextColor(PRIMARY);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("ELITE TRANSIT TRANSPORT LOGISTIQUE", marginX + 16, 11);

            doc.setTextColor("#888888");
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            doc.text("19, Boulevard Djily Mbaye Immeuble Fahd 5ème étage - Dakar",
                marginX + 16, 14.5);
            doc.text("RCCM: SN-DKR-2015-13017 / NINEA: 005553020",
                marginX + 16, 18.5);
            doc.text("Tel: +221 33 822 48 67 / Email: elitetransit16@gmail.com",
                marginX + 16, 22.5);

            doc.setTextColor("#333333");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("Rapport des Clients — " + new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
                pageW - marginX, 13, { align: "right" });

            doc.setTextColor("#999999");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const date = new Date().toLocaleDateString("fr-FR",
                { day: "2-digit", month: "long", year: "numeric" });
            doc.text("Généré le " + date,
                pageW - marginX, 18.5, { align: "right" });

            // Ajout des stats dans le PDF
            doc.setFontSize(8);
            doc.setTextColor(PRIMARY);
            doc.text(`Total Clients: ${stats.totalClients} | Total Dossiers: ${stats.totalDossiers} | Montant Total: ${new Intl.NumberFormat("fr-FR").format(stats.totalMontant)} FCFA`,
                marginX, headerH + 5);
        }

        function piedDePage(data: any) {
            const { pageNumber, pageCount } = data;
            const y = pageH - footerH;

            doc.setDrawColor("#eeeeee");
            doc.setLineWidth(0.3);
            doc.line(marginX, y, pageW - marginX, y);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor("#aaaaaa");

            doc.text("Elite Transit Transport Logistique",
                marginX, pageH - 5);
            doc.text("Votre partenaire de confiance pour le transport et la logistique",
                pageW / 2, pageH - 5, { align: "center" });
            doc.text("Page " + pageNumber + " / " + pageCount,
                pageW - marginX, pageH - 5, { align: "right" });
        }

        const headers = columns
            .filter((col) => 'accessorKey' in col && col.accessorKey !== "actions")
            .map((col) => 'header' in col ? col.header : "");

        const rows = clients.map((client) => {
            const total = client.dossiers.reduce(
                (sum: number, v: any) => sum + Number(v.montant_total),
                0
            );

            const versements = client.dossiers
                .flatMap((d: any) => d.versement)
                .reduce((sum: number, v: any) => sum + Number(v.montant), 0);

            const reste = total - versements;
            const statut = total === 0 && versements === 0 ? "Nouveau" : reste <= 0 ? "Payé" : "En cours";

            return [
                client.name,
                `${client.dossiers.length} dossier(s)`,
                statut,
                versements,
                total,
                reste,
            ];
        });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(PRIMARY);
        doc.text("Récapitulatif des Clients",
            marginX, headerH + 14);

        autoTable(doc, {
            head: [["Nom", "Dossiers", "Statut", "Versements", "Net à Payer", "Restant"]],
            body: rows,
            startY: headerH + 20,
            margin: { left: marginX, right: marginX },
            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 3,
                lineColor: "#dddddd",
                lineWidth: 0.2,
            },
            headStyles: {
                fillColor: PRIMARY,
                textColor: "#ffffff",
                fontStyle: "bold",
                halign: "left",
            },
            alternateRowStyles: {
                fillColor: "#f0f5ff",
            },
            didParseCell(data) {
                if (data.section === "body" && data.column.index === 2) {
                    const v = data.cell.raw;
                    if (v === "Payé") data.cell.styles.textColor = "#438f0d";
                    if (v === "En cours") data.cell.styles.textColor = "#c70c0c";
                    if (v === "Nouveau") data.cell.styles.textColor = "#e8810c";
                }
            },
            didDrawPage(data) {
                enTete();
                piedDePage(data);
            },
        });

        doc.save(generateFileName());
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Client & Dossiers",
            cell: ({ row }) => {

                return (
                    <div className="flex items-center justify-between w-full">
                        <FooterUser user={row.original} docs={row.original.dossiers} />
                    </div>
                )
            }
        },
        {
            accessorKey: "dossiers_count",
            header: "Dossiers",
            cell: ({ row }) => {
                const dossiersCount = row.original.dossiers?.length || 0;
                return <DossiersCounter count={dossiersCount} />
            }
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total || 0), 0)
                const totalVersement = row.original.dossiers
                    .flatMap((d: any) => d.versement || [])
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant || 0), 0);
                const result = totalMontant - totalVersement

                if (totalMontant === 0 && totalVersement === 0) {
                    return (
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">
                            <IconFolder className="h-3 w-3 mr-1" />
                            Nouveau
                        </Badge>
                    )
                }

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
            accessorKey: "versement",
            header: "Versements",
            cell({ row }) {
                const total = row.original.dossiers
                    .flatMap((d: any) => d.versement || [])
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant || 0), 0);

                return (
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat("fr-FR").format(total)} FCFA
                    </span>
                )
            },
        },
        {
            accessorKey: "netpaye",
            header: "Net à Payer",
            cell({ row }) {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total || 0), 0)
                return (
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat("fr-FR").format(totalMontant)} FCFA
                    </span>
                )
            },
        },
        {
            accessorKey: "restant",
            header: "Reste à Payer",
            cell({ row }) {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total || 0), 0)
                const totalVersement = row.original.dossiers
                    .flatMap((d: any) => d.versement || [])
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant || 0), 0);
                const result = totalMontant - totalVersement

                return (
                    <span className={cn(
                        "font-bold",
                        result > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    )}>
                        {new Intl.NumberFormat("fr-FR").format(result)} FCFA
                    </span>
                )
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell({ row }) {
                return (
                    <div className="flex items-center gap-1">
                        <TrashComponent user={row.original} />
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: clients,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination,
        },
    })



    return (
        <div className="p-4 w-full space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
                <Input
                    placeholder="Rechercher par nom..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button
                    variant="outline"
                    className="ml-auto gap-2 bg-linear-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-0"
                    onClick={() => exportTablePDF()}
                >
                    <IconFileText className="h-4 w-4" />
                    Export PDF
                </Button>
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
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun résultat trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4 p-2">
                <div className="text-sm text-gray-500">
                    Affichage de {table.getRowModel().rows.length} sur {clients.length} clients
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
        </div>
    );
}