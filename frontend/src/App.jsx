import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './router';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { InstallPwaPrompt } from './components/pwa/InstallPwaPrompt';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { AppLayout } from './components/layout/AppLayout';
import { PageTransition } from './components/layout/PageTransition';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';
import { ServicesPage } from './pages/ServicesPage';
import { AuthPage } from './pages/AuthPage';
import { PortalPage } from './pages/PortalPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { NotFoundPage } from './pages/NotFoundPage';

function RouteSwitch() {
  const { currentPath } = useRouter();

  // Normalize path without query params and trailing slashes
  const pathWithoutQuery = currentPath.split('?')[0];
  const normalized = pathWithoutQuery.toLowerCase().replace(/\/+$/, '') || '/';

  let Component;
  switch (normalized) {
    case '/':
      Component = HomePage;
      break;
    case '/about':
      Component = AboutPage;
      break;
    case '/products':
    case '/store':
    case '/shop':
    case '/systems':
    case '/catalogue':
      Component = ProductsPage;
      break;
    case '/services':
      Component = ServicesPage;
      break;
    case '/contact':
    case '/dealership':
      Component = ContactPage;
      break;
    case '/auth':
    case '/login':
    case '/signup':
      Component = AuthPage;
      break;
    case '/onboarding':
    case '/welcome':
    case '/start':
      Component = OnboardingPage;
      break;
    case '/portal':
    case '/dashboard':
    case '/account':
    case '/admin':
    case '/admin-dashboard':
    case '/workshop-admin':
      Component = PortalPage;
      break;
    default:
      Component = NotFoundPage;
      break;
  }

  return (
    <PageTransition key={normalized}>
      <Component />
    </PageTransition>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    // Elegant introductory brand initialization
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setInitialLoading(false), 300);
          return 100;
        }
        return prev + 25;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <RouterProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            {initialLoading && (
              <LoadingScreen
                message="Radhe Radios Kota — Initializing Sound Engine..."
                progress={loadProgress}
              />
            )}
            <AppLayout>
              <RouteSwitch />
            </AppLayout>
            {/* Progressive Web App Network Status & Install Experience */}
            <OfflineIndicator />
            <InstallPwaPrompt />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </RouterProvider>
  );
}
