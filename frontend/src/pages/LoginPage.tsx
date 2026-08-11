import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Custom styling wrapper untuk menyelaraskan visual Clerk dengan Brand UMKM */}
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          afterSignInUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-amber-900 hover:bg-amber-800 text-sm font-semibold transition',
              card: 'border border-stone-200 shadow-sm rounded-2xl',
              footerActionLink: 'text-amber-900 hover:text-amber-800 font-semibold'
            }
          }}
        />
      </div>
    </div>
  );
};
export default LoginPage;
