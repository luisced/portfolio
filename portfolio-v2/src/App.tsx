import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import AnimatedRoute from './components/common/AnimatedRoute';
import HomePageSkeleton from './features/home/HomePageSkeleton';
import PortfolioPageSkeleton from './features/portfolio/PortfolioPageSkeleton';
import AboutPageSkeleton from './features/about/AboutPageSkeleton';
import './App.css';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('./features/home/HomePage'));
const About = lazy(() => import('./features/about/AboutPage'));
const Portfolio = lazy(() => import('./features/portfolio/PortfolioPage'));
const ProjectDetailPage = lazy(() => import('./features/portfolio/ProjectDetailPage'));
const Contact = lazy(() => import('./features/contact/ContactPage'));
const NotFound = lazy(() => import('./features/errors/NotFound'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={
                  <ErrorBoundary>
                    <Suspense fallback={<HomePageSkeleton />}>
                      <AnimatedRoute>
                        <Home />
                      </AnimatedRoute>
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="about" element={
                  <ErrorBoundary>
                    <Suspense fallback={<AboutPageSkeleton />}>
                      <AnimatedRoute>
                        <About />
                      </AnimatedRoute>
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="portfolio" element={
                  <ErrorBoundary>
                    <Suspense fallback={<PortfolioPageSkeleton />}>
                      <AnimatedRoute>
                        <Portfolio />
                      </AnimatedRoute>
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="portfolio/:id" element={
                  <ErrorBoundary>
                    <Suspense fallback={<Loading />}>
                      <AnimatedRoute>
                        <ProjectDetailPage />
                      </AnimatedRoute>
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="contact" element={
                  <ErrorBoundary>
                    <Suspense fallback={<Loading />}>
                      <AnimatedRoute>
                        <Contact />
                      </AnimatedRoute>
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="*" element={
                  <ErrorBoundary>
                    <Suspense fallback={<Loading />}>
                      <AnimatedRoute>
                        <NotFound />
                      </AnimatedRoute>
                    </Suspense>
                  </ErrorBoundary>
                } />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
