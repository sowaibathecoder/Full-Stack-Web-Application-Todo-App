import { TaskRead } from '@/types/tasks';

interface TaskCompletionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: number) => void;
  taskId: number;
  taskTitle: string;
  isCompleting: boolean;
  loading?: boolean;
}

export const TaskCompletionConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  taskId,
  taskTitle,
  isCompleting,
  loading = false
}: TaskCompletionConfirmationProps) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(taskId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  {isCompleting ? 'Complete Task?' : 'Mark as Pending?'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Are you sure you want to {isCompleting ? 'mark' : 'change'} the task "{taskTitle}" as{' '}
                    {isCompleting ? 'completed' : 'pending'}?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row sm:justify-end">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Processing...' : (isCompleting ? 'Mark Complete' : 'Mark Pending')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};