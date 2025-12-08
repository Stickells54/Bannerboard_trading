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
import type { TradePriceItem } from '../types/models';

interface TradePricesProps {
  goods: TradePriceItem[];
}

export function TradePrices({ goods }: TradePricesProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'ProfitMargin', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<TradePriceItem>[]>(
    () => [
      {
        accessorKey: 'Name',
        header: 'Item',
      },
      {
        accessorKey: 'LowestPrice',
        header: 'Buy Price',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="small">
              <div><strong>{info.getValue() as number}</strong> denars</div>
              <div className="text-muted">{row.LowestPriceTown}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'HighestPrice',
        header: 'Sell Price',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="small">
              <div><strong>{info.getValue() as number}</strong> denars</div>
              <div className="text-muted">{row.HighestPriceTown}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'ProfitMargin',
        header: 'Profit',
        cell: (info) => (
          <span className="badge bg-success">
            {(info.getValue() as number).toLocaleString()} denars
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: goods,
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
        pageSize: 15,
      },
    },
  });

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">Trade Prices</h5>
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ width: '200px' }}
            placeholder="Search goods..."
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
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: 'pointer' }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} goods
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
