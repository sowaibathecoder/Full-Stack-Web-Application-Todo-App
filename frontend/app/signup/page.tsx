import { SignupForm } from '@/components/SignupForm';

export const metadata = {
  title: 'Sign Up - Todo App',
  description: 'Create a new Todo App account to start managing your tasks.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}