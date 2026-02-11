import { useState, useEffect } from 'react';
import { PrioritySelector } from './PrioritySelector';

interface FilterBarProps {
  initialFilters?: {
    status?: string;
    priority?: string;
    tag?: string;
    search?: string;
    due_before?: string;
    due_after?: string;
    sort?: string;
    order?: string;
  };
  onFiltersChange: (filters: {
    status: string;
    priority: string;
    tag: string;
    search: string;
    due_before: string;
    due_after: string;
    sort: string;
    order: string;
  }) => void;
}

export const FilterBar = ({ initialFilters, onFiltersChange }: FilterBarProps) => {
  const [status, setStatus] = useState(initialFilters?.status || 'all');
  const [priority, setPriority] = useState(initialFilters?.priority || '');
  const [tag, setTag] = useState(initialFilters?.tag || '');
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [dueBefore, setDueBefore] = useState(initialFilters?.due_before || '');
  const [dueAfter, setDueAfter] = useState(initialFilters?.due_after || '');
  const [sort, setSort] = useState(initialFilters?.sort || 'created_at');
  const [order, setOrder] = useState(initialFilters?.order || 'desc');

  // Sync with initial filters when they change
  useEffect(() => {
    setStatus(initialFilters?.status || 'all');
    setPriority(initialFilters?.priority || '');
    setTag(initialFilters?.tag || '');
    setSearch(initialFilters?.search || '');
    setDueBefore(initialFilters?.due_before || '');
    setDueAfter(initialFilters?.due_after || '');
    setSort(initialFilters?.sort || 'created_at');
    setOrder(initialFilters?.order || 'desc');
  }, [initialFilters]);

  const handleApplyFilters = () => {
    onFiltersChange({
      status,
      priority,
      tag,
      search,
      due_before: dueBefore,
      due_after: dueAfter,
      sort,
      order
    });
  };

  const handleResetFilters = () => {
    setStatus('all');
    setPriority('');
    setTag('');
    setSearch('');
    setDueBefore('');
    setDueAfter('');
    setSort('created_at');
    setOrder('desc');

    onFiltersChange({
      status: 'all',
      priority: '',
      tag: '',
      search: '',
      due_before: '',
      due_after: '',
      sort: 'created_at',
      order: 'desc'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all" className="dark:bg-gray-700 dark:text-white">All</option>
            <option value="pending" className="dark:bg-gray-700 dark:text-white">Pending</option>
            <option value="completed" className="dark:bg-gray-700 dark:text-white">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <PrioritySelector
            priority={priority || null}
            onChange={setPriority}
          />
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission which could cause reset
                handleApplyFilters();
              }
            }}
            placeholder="Search tasks..."
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
          <div className="flex space-x-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="created_at" className="dark:bg-gray-700 dark:text-white">Created At</option>
              <option value="due_date" className="dark:bg-gray-700 dark:text-white">Due Date</option>
              <option value="priority" className="dark:bg-gray-700 dark:text-white">Priority</option>
              <option value="title" className="dark:bg-gray-700 dark:text-white">Title</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-24 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="asc" className="dark:bg-gray-700 dark:text-white">Asc</option>
              <option value="desc" className="dark:bg-gray-700 dark:text-white">Desc</option>
            </select>
          </div>
        </div>

        {/* Due Date Range */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due After</label>
          <input
            type="date"
            value={dueAfter}
            onChange={(e) => setDueAfter(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Before</label>
          <input
            type="date"
            value={dueBefore}
            onChange={(e) => setDueBefore(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission which could cause reset
                handleApplyFilters();
              }
            }}
            placeholder="Filter by tag..."
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
        <button
          onClick={handleApplyFilters}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};