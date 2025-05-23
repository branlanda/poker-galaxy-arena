
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
