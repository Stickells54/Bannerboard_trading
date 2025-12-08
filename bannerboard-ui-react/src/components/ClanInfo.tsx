import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import type { ClanInfoModel, WorkshopInfo, FiefInfo } from '../types/models';

interface ClanInfoProps {
  data: ClanInfoModel;
}

const workshopColumnHelper = createColumnHelper<WorkshopInfo>();
const fiefColumnHelper = createColumnHelper<FiefInfo>();

export function ClanInfo({ data }: ClanInfoProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'workshops' | 'fiefs'>('overview');
  const [workshopSorting, setWorkshopSorting] = useState<SortingState>([]);
  const [fiefSorting, setFiefSorting] = useState<SortingState>([]);
  const [workshopFilters, setWorkshopFilters] = useState<ColumnFiltersState>([]);
  const [fiefFilters, setFiefFilters] = useState<ColumnFiltersState>([]);

  // Workshop columns
  const workshopColumns = useMemo(
    () => [
      workshopColumnHelper.accessor('Name', {
        header: 'Workshop',
        cell: (info) => info.getValue(),
      }),
      workshopColumnHelper.accessor('Type', {
        header: 'Type',
        cell: (info) => info.getValue(),
      }),
      workshopColumnHelper.accessor('Settlement', {
        header: 'Location',
        cell: (info) => info.getValue(),
      }),
      workshopColumnHelper.accessor('DailyProfit', {
        header: 'Daily Profit',
        cell: (info) => {
          const value = info.getValue();
          const colorClass = value >= 0 ? 'text-success' : 'text-danger';
          return <span className={colorClass}>{value >= 0 ? '+' : ''}{value} gold</span>;
        },
      }),
    ],
    []
  );

  // Fief columns
  const fiefColumns = useMemo(
    () => [
      fiefColumnHelper.accessor('Name', {
        header: 'Settlement',
        cell: (info) => info.getValue(),
      }),
      fiefColumnHelper.accessor('Type', {
        header: 'Type',
        cell: (info) => {
          const type = info.getValue();
          const badgeClass =
            type === 'Town' ? 'bg-primary' : type === 'Castle' ? 'bg-warning' : 'bg-secondary';
          return <span className={`badge ${badgeClass}`}>{type}</span>;
        },
      }),
      fiefColumnHelper.accessor('Prosperity', {
        header: 'Prosperity',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      fiefColumnHelper.accessor('Garrison', {
        header: 'Garrison',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      fiefColumnHelper.accessor('Militia', {
        header: 'Militia',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      fiefColumnHelper.accessor('FoodStocks', {
        header: 'Food',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      fiefColumnHelper.accessor('Loyalty', {
        header: 'Loyalty',
        cell: (info) => {
          const value = info.getValue();
          const percentage = Math.min(100, Math.max(0, value));
          const colorClass = value >= 75 ? 'text-success' : value >= 50 ? 'text-warning' : 'text-danger';
          return <span className={colorClass}>{percentage.toFixed(0)}</span>;
        },
      }),
      fiefColumnHelper.accessor('Security', {
        header: 'Security',
        cell: (info) => {
          const value = info.getValue();
          const percentage = Math.min(100, Math.max(0, value));
          const colorClass = value >= 75 ? 'text-success' : value >= 50 ? 'text-warning' : 'text-danger';
          return <span className={colorClass}>{percentage.toFixed(0)}</span>;
        },
      }),
    ],
    []
  );

  const workshopTable = useReactTable({
    data: data.Workshops,
    columns: workshopColumns,
    state: {
      sorting: workshopSorting,
      columnFilters: workshopFilters,
    },
    onSortingChange: setWorkshopSorting,
    onColumnFiltersChange: setWorkshopFilters,
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

  const fiefTable = useReactTable({
    data: data.Fiefs,
    columns: fiefColumns,
    state: {
      sorting: fiefSorting,
      columnFilters: fiefFilters,
    },
    onSortingChange: setFiefSorting,
    onColumnFiltersChange: setFiefFilters,
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

  const renderTable = <T,>(table: ReturnType<typeof useReactTable<T>>) => (
    <>
      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead className="table-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: 'pointer' }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {typeof header.column.columnDef.header === 'function'
                          ? (header.column.columnDef.header as any)(header.getContext())
                          : header.column.columnDef.header}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </>
                    )}
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
                    {typeof cell.column.columnDef.cell === 'function'
                      ? (cell.column.columnDef.cell as any)(cell.getContext())
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="mb-0">Clan: {data.ClanName}</h5>
      </div>
      <div className="card-body">
        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              type="button"
            >
              Overview
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'workshops' ? 'active' : ''}`}
              onClick={() => setActiveTab('workshops')}
              type="button"
            >
              Workshops ({data.Workshops.length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'fiefs' ? 'active' : ''}`}
              onClick={() => setActiveTab('fiefs')}
              type="button"
            >
              Fiefs ({data.Fiefs.length})
            </button>
          </li>
        </ul>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Clan Stats</h6>
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-2">
                        <small className="text-muted">Tier</small>
                        <div className="h4 mb-0">{data.Tier}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Renown</small>
                        <div className="h4 mb-0">{data.Renown.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-2">
                        <small className="text-muted">Influence</small>
                        <div className="h4 mb-0">{data.Influence.toLocaleString()}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Gold</small>
                        <div className="h4 mb-0 text-warning">{data.Gold.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Finances</h6>
                  <div className="mb-2">
                    <small className="text-muted">Total Income</small>
                    <div className="h5 mb-0 text-success">+{data.TotalIncome.toLocaleString()} gold/day</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Total Expenses</small>
                    <div className="h5 mb-0 text-danger">-{data.TotalExpenses.toLocaleString()} gold/day</div>
                  </div>
                  <hr />
                  <div className="mb-0">
                    <small className="text-muted">Net Income</small>
                    <div className={`h4 mb-0 ${data.NetIncome >= 0 ? 'text-success' : 'text-danger'}`}>
                      {data.NetIncome >= 0 ? '+' : ''}{data.NetIncome.toLocaleString()} gold/day
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Holdings Summary</h6>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="h2 mb-0">{data.Workshops.length}</div>
                        <small className="text-muted">Workshops</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="h2 mb-0">{data.Fiefs.filter(f => f.Type === 'Town').length}</div>
                        <small className="text-muted">Towns</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="h2 mb-0">{data.Fiefs.filter(f => f.Type === 'Castle').length}</div>
                        <small className="text-muted">Castles</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workshops Tab */}
        {activeTab === 'workshops' && (
          <>
            {data.Workshops.length > 0 ? (
              renderTable(workshopTable)
            ) : (
              <div className="text-center text-muted py-4">No workshops owned</div>
            )}
          </>
        )}

        {/* Fiefs Tab */}
        {activeTab === 'fiefs' && (
          <>
            {data.Fiefs.length > 0 ? (
              renderTable(fiefTable)
            ) : (
              <div className="text-center text-muted py-4">No fiefs owned</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
