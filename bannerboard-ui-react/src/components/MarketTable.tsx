import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
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
import type { MarketItem } from '../types/models';

interface MarketTableProps {
  // data removed from props, fetched internally
  availableCities: string[];
  initialCity?: string;
}

export function MarketTable({ availableCities, initialCity }: MarketTableProps) {
  const [data, setData] = useState<MarketItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || availableCities[0] || '');
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    if (selectedCity) {
      setLoading(true);
      axios.get<MarketItem[]>(`http://localhost:8080/api/market/${selectedCity}`)
        .then(response => {
          setData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch market data", error);
          setLoading(false);
        });
    }
  }, [selectedCity]);

  const onCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const columns = useMemo<ColumnDef<MarketItem>[]>(
    () => [
      {
        accessorKey: 'Name',
        header: 'Item',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'Price',
        header: 'Price',
        cell: (info) => {
          const price = info.getValue() as number;
          return price > 0 ? (
            <span className="badge bg-primary">{price}</span>
          ) : (
            <span className="text-muted">N/A</span>
          );
        },
      },
      {
        accessorKey: 'Category',
        header: 'Category',
        cell: (info) => <small className="text-muted">{info.getValue() as string}</small>,
      },
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
        pageSize: 20,
      },
    },
  });

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0">City Market</h5>
          <select
            className="form-select form-select-sm"
            style={{ width: '200px' }}
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
          >
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ width: '250px' }}
            placeholder="Search items..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {loading && (
            <div className="text-center p-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <table className={`table table-sm table-hover table-striped ${loading ? 'opacity-50' : ''}`}>
            <thead className="sticky-top bg-dark text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
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
          <div>
            <small className="text-muted">
              Showing {table.getRowModel().rows.length} of {data.length} items
            </small>
          </div>
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-secondary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button className="btn btn-outline-secondary" disabled>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </button>
            <button
              className="btn btn-outline-secondary"
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
