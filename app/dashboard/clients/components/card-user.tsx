"use client"

import FooterUser from "./user-footer";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled, IconLoader, IconPencil } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import TrashComponent from "./trash";
import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, useReactTable } from "@tanstack/react-table";

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
    // const sortableId = useId()

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
            header: "Status",
            cell: ({ row }) => {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total), 0)
                const totalVersement = row.original.dossiers
                    .flatMap((d: any) => d.versement)
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant), 0);
                const result = totalMontant - totalVersement

                return (
                    <Badge variant="outline" className={cn("", result <= 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-600 text-white dark:bg-red-600 dark:text-white")}>
                        {result <= 0 ? (
                            <><IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" /> PAYÉ</>
                        ) : (
                            <><IconLoader />En cours</>
                        )}
                    </Badge>
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