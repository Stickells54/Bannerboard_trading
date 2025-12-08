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
import type { TradeRoute } from '../types/models';

interface TradeRoutesProps {
  routes: TradeRoute[];
}

export function TradeRoutes({ routes }: TradeRoutesProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'AvgProfit', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<TradeRoute>[]>(
    () => [
      {
        accessorKey: 'GoodName',
        header: 'Good',
      },
      {
        accessorKey: 'BuyTown',
        header: 'Buy From',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="small">
              <div>{info.getValue() as string}</div>
              <div className="text-success">{row.AvgBuyPrice} denars</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'SellTown',
        header: 'Sell To',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="small">
              <div>{info.getValue() as string}</div>
              <div className="text-primary">{row.AvgSellPrice} denars</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'AvgProfit',
        header: 'Profit',
        cell: (info) => (
          <span className="badge bg-success">
            {(info.getValue() as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'StabilityScore',
        header: 'Stability',
        cell: (info) => {
          const score = info.getValue() as number;
          const color = score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger';
          return <span className={`badge bg-${color}`}>{score}%</span>;
        },
      },
      {
        accessorKey: 'RiskLevel',
        header: 'Risk',
        cell: (info) => {
          const risk = info.getValue() as string;
          const color = risk === 'Low' ? 'success' : risk === 'Medium' ? 'warning' : 'danger';
          return <span className={`badge bg-${color}`}>{risk}</span>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: routes,
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
          <h5 className="mb-0">Best Trade Routes</h5>
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ width: '200px' }}
            placeholder="Search routes..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="card-body">
        {routes.length === 0 ? (
          <div className="alert alert-info">
            No trade routes calculated yet. Routes will appear as you explore towns.
          </div>
        ) : (
          <>
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
                Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} routes
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
          </>
        )}
      </div>
    </div>
  );
}
