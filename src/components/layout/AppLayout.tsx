
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalChat } from '../community/GlobalChat';
import { useAuth } from '@/stores/auth';

interface AppLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  hideChat?: boolean;
}

export function AppLayout({ 
  children, 
  hideFooter = false,
  hideChat = false 
}: AppLayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-navy">
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>
      
      {!hideFooter && <Footer />}
      
      {!hideChat && user && <GlobalChat defaultOpen={false} />}
    </div>
  );
}
