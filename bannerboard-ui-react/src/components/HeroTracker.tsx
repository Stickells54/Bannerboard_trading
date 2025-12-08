import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';

import type { HeroTrackerItem } from '../types/models';

interface HeroTrackerProps {
    data: HeroTrackerItem[];
}

export function HeroTracker({ data }: HeroTrackerProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo<ColumnDef<HeroTrackerItem>[]>(
        () => [
            {
                accessorKey: 'Name',
                header: 'Hero Name',
                cell: (info) => <span className="fw-bold">{info.getValue() as string}</span>,
            },
            {
                accessorKey: 'Location',
                header: 'Last Known Location',
                cell: (info) => {
                    const val = info.getValue() as string;
                    return val === '-' ? <span className="text-muted">Unknown</span> : val;
                },
            },
            {
                accessorKey: 'IsDead',
                header: 'Status',
                cell: (info) => {

                    if (info.row.original.IsDead) return <span className="badge bg-danger">Dead</span>;
                    if (info.row.original.IsDisabled) return <span className="badge bg-warning text-dark">Disabled</span>;
                    return <span className="badge bg-success">Active</span>;
                },
            },
            {
                accessorKey: 'IsShownOnMap',
                header: 'Tracked',
                cell: (info) => {
                    return info.getValue() ? "Yes" : "No"
                }
            }
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="card h-100">
            <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">Hero Tracker</h5>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        style={{ width: '200px' }}
                        placeholder="Search heroes..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-sm table-hover">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === 'asc' && ' 🔼'}
                                            {header.column.getIsSorted() === 'desc' && ' 🔽'}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                    <small className="text-muted">Showing {table.getRowModel().rows.length} tracked heroes</small>
                    <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</button>
                        <button className="btn btn-outline-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
