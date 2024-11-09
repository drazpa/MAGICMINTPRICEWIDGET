import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TokenList } from './components/TokenList';
import { Header } from './components/Header';
import { XRPPriceBanner } from './components/XRPPriceBanner';
import { Portfolio } from './pages/Portfolio';
import { AllCoins } from './pages/AllCoins';
import { FeaturedCoins } from './pages/FeaturedCoins';
import { ThemeProvider } from './context/ThemeContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useTokens } from './hooks/useTokens';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
    <p className="text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
    <Link to="/all-coins" className="text-blue-600 dark:text-blue-400 hover:underline">
      Return to home
    </Link>
  </div>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <XRPPriceBanner />
    <Header />
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

const paypalOptions = {
  "client-id": "test", // Using test client ID for development
  currency: "USD",
  intent: "capture"
};

export const App: React.FC = () => {
  const { 
    tokens, 
    loading, 
    error, 
    refetch,
    isRefreshing,
    toggleFavorite,
    isFavorite
  } = useTokens();

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <ThemeProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/all-coins" replace />} />
              <Route path="/all-coins" element={<AllCoins />} />
              <Route path="/featured" element={<FeaturedCoins />} />
              <Route 
                path="/top-100" 
                element={
                  <TokenList 
                    tokens={tokens} 
                    loading={loading} 
                    error={error} 
                    onRefresh={refetch}
                    isRefreshing={isRefreshing}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                } 
              />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </PayPalScriptProvider>
  );
};