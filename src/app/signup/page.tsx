
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:via-background dark:to-accent/20">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
