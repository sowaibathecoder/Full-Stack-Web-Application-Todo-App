interface SortControlsProps {
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
}

export const SortControls = ({ sortField, sortOrder, onSortChange }: SortControlsProps) => {
  const fields = [
    { value: 'created_at', label: 'Created At' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  const handleFieldChange = (field: string) => {
    onSortChange(field, sortOrder);
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    onSortChange(sortField, order);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <label htmlFor="sort-field" className="mr-2 text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort-field"
          value={sortField}
          onChange={(e) => handleFieldChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {fields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <label htmlFor="sort-order" className="mr-2 text-sm font-medium text-gray-700">
          Order:
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => handleOrderChange(e.target.value as 'asc' | 'desc')}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <button
        onClick={() => handleOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {sortOrder === 'asc' ? (
          <>
            <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Asc
          </>
        ) : (
          <>
            <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Desc
          </>
        )}
      </button>
    </div>
  );
};