"use client"

import FooterUser from "./user-footer";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled, IconLoader, IconPencil } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import TrashComponent from "./trash";
import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function CardUser() {

    const clients = useClientsStore((state) => state.clients)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })



    const exportTablePDF = () => {
        // const doc = new jsPDF({ orientation: "landscape" });
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // ── Config ───────────────────────────────────────────────
        const PRIMARY = "#2a6dd9";
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const marginX = 15;
        const headerH = 26;
        const footerH = 12;

        // ── Helpers en-tête / pied de page ───────────────────────
        function enTete() {
            // Ligne bleue de séparation
            doc.setDrawColor(PRIMARY);
            doc.setLineWidth(0.6);
            doc.line(marginX, headerH, pageW - marginX, headerH);

            // Logo
            doc.setFillColor(PRIMARY);
            doc.roundedRect(marginX, 7, 13, 13, 2, 2, "F");
            doc.setTextColor("#ffffff");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("E", marginX + 6.5, 15.5, { align: "center" });

            // Nom + slogan
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


            // Titre doc + date (droite)
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
                statut,
                versements,
                total,
                reste,
            ];
        });

        // // 👉 HEADER
        // const addHeader = () => {
        //     doc.setFontSize(12);
        //     doc.text("ELITE TRANSIT TRANSPORT LOGISTIQUE - RAPPORT CLIENTS", 14, 15);
        //     doc.setFontSize(10);
        //     doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - 60, 15);
        // };

        // // 👉 FOOTER
        // const addFooter = (pageNumber: number) => {
        //     doc.setFontSize(10);
        //     doc.text(
        //         `Page ${pageNumber}`,
        //         pageWidth / 2,
        //         pageHeight - 10,
        //         { align: "center" }
        //     );
        // };

        // ── Titre au-dessus du tableau ────────────────────────────
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(PRIMARY);
        doc.text("Récapitulatif des Clients",
            marginX, headerH + 10);


        autoTable(doc, {
            head: [headers as string[]],
            body: rows,

            startY: headerH + 14,        // départ sous l'en-tête
            margin: { left: marginX, right: marginX },

            // ── Style global ─────────────────────────────────────
            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 3,
                lineColor: "#dddddd",
                lineWidth: 0.2,
            },
            // ── En-tête du tableau ────────────────────────────────
            headStyles: {
                fillColor: PRIMARY,
                textColor: "#ffffff",
                fontStyle: "bold",
                halign: "left",
            },

            // ── Lignes alternées (zèbre) ──────────────────────────
            alternateRowStyles: {
                fillColor: "#f0f5ff",
            },

            // ── Pied du tableau (ligne de total) ──────────────────
            // foot: [["", "", "", "Total", "1 833 000 FCFA", "1 833 000 FCFA", ""]],
            // footStyles: {
            //     fillColor: "#e6f1fb",
            //     textColor: PRIMARY,
            //     fontStyle: "bold",
            // },
            // showFoot: "lastPage",

            // ── Colonnes : largeurs individuelles ─────────────────
            // columnStyles: {
            //     0: { cellWidth: 12, halign: "center" },  // #
            //     3: { cellWidth: 10, halign: "center" },  // Qté
            //     4: { cellWidth: 28, halign: "right" },  // P.U.
            //     5: { cellWidth: 30, halign: "right" },  // Total
            //     6: { cellWidth: 24, halign: "center" },  // Statut
            // },

            // ── Colorier les cellules "Statut" ────────────────────
            didParseCell(data) {
                if (data.section === "body" && data.column.index === 1) {
                    const v = data.cell.raw;
                    if (v === "Payé") data.cell.styles.textColor = "#438f0d";
                    if (v === "En cours") data.cell.styles.textColor = "#c70c0c";
                    if (v === "Nouveau") data.cell.styles.textColor = "#e8810c";
                }
            },

            // ── En-tête + pied de page sur chaque page ────────────
            didDrawPage(data) {
                enTete();
                piedDePage(data);
            },
            // 👉 HEADER sur chaque page
            // didDrawPage: () => {
            //     // addHeader();
            //     dessinerEnTete(pageNumber);
            //     dessinerPiedDePage(pageNumber);
            //     pageNumber++;
            // },
        });

        doc.save(generateFileName());
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                return (
                    <FooterUser user={row.original} docs={row.original.dossiers} />
                )
            }
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total), 0)
                const totalVersement = row.original.dossiers
                    .flatMap((d: any) => d.versement)
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant), 0);
                const result = totalMontant - totalVersement

                return (
                    totalMontant === 0 && totalVersement === 0 ? (<Badge variant="outline" className="bg-orange-300 text-amber-50">Nouveau</Badge>) :
                        (
                            <Badge variant="outline" className={cn("", result <= 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-600 text-white dark:bg-red-600 dark:text-white")}>
                                {result <= 0 ? (
                                    <><IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" /> PAYÉ</>
                                ) : (
                                    <><IconLoader />En cours</>
                                )}
                            </Badge>
                        )
                )
            }
        },
        {
            accessorKey: "versement",
            header: "Versement",
            cell({ row }) {
                const total = row.original.dossiers
                    .flatMap((d: any) => d.versement)
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant), 0);

                // console.log("total versement =>", total)

                return new Intl.NumberFormat("fr-FR").format(total)

            },
        },
        {
            accessorKey: "netpaye",
            header: "Net A Payer",
            cell({ row }) {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total), 0)
                return new Intl.NumberFormat("fr-FR").format(totalMontant)
            },
        },
        {
            accessorKey: "restant",
            header: "Restant",
            cell({ row }) {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total), 0)
                const totalVersement = row.original.dossiers
                    .flatMap((d: any) => d.versement)
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant), 0);
                const result = totalMontant - totalVersement
                return (
                    <div >
                        {/* className={
                            cn("font-bold", result > 0 ? "text-red-500 " : "text-green-500")
                        } */}
                        {new Intl.NumberFormat("fr-FR").format(result)}
                    </div>
                )
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell({ row }) {
                return <TrashComponent user={row.original} />
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
        <div className="p-2 w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter nom..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button variant="outline" className="ml-2" onClick={() => exportTablePDF()} >
                    Export PDF
                </Button>
            </div>
            <div className="overflow-hidden rounded-md border w-full">

                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit p-2">
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <IconChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <IconChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}