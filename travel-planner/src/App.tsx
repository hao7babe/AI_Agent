import React from 'react';
import AppRoutes from './routes';
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';
import './styles/global.css';
// import LoginPage from './auth/LoginPage';
// import { useAuth } from './auth/useAuth';

const App: React.FC = () => {
  return (
    <article className="app-container">
      <Navigation />
      <main className="main-content">
        <AppRoutes />
      </main>
      <ScrollToTop />
    </article>
  );
};

export default App;
