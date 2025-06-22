import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import LotDetail from './pages/LotDetail';
import Login from './pages/Login';
import { SensorProvider } from './contexts/SensorContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PricingProvider } from './contexts/PricingContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <SensorProvider>
        <PricingProvider>
          <AuthProvider>
            <Router>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lot/:id"
                  element={
                    <ProtectedRoute>
                      <LotDetail />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
        </PricingProvider>
      </SensorProvider>
    </ThemeProvider>
  );
}

export default App;
