import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-navy">
      {/* Your app layout implementation */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
