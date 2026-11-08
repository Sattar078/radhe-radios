import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuickContactBar } from '../ui/QuickContactBar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { useRouter } from '../../router';

export function AppLayout({ children }) {
  const { currentPath } = useRouter();
  const isDashboardPage = currentPath === '/portal' || currentPath.startsWith('/portal');

  return (
    <div className={`relative w-full min-h-screen bg-[#080808] text-[#F5F5F5] overflow-x-hidden flex flex-col justify-between selection:bg-[#00e5ff] selection:text-[#080808] ${
      isDashboardPage ? 'pb-8' : 'pb-24 sm:pb-16'
    }`}>
      {/* Global Sticky Navigation Header */}
      <Navbar />

      {/* Main Page Landmark */}
      <main id="main-content" className="w-full flex-grow pt-0">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Global Studio Footer */}
      <Footer />

      {/* Fixed Call & WhatsApp Floating Bar (Hidden in Admin/Client Dashboard to keep controls accessible) */}
      {!isDashboardPage && <QuickContactBar />}
    </div>
  );
}
