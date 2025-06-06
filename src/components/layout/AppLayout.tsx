
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";

interface AppLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export function AppLayout({ children, showBreadcrumbs = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      {showBreadcrumbs && <Breadcrumbs />}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
