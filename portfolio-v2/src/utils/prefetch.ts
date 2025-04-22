/**
 * Map of routes to their corresponding component import functions
 */
const routeComponentMap: Record<string, () => Promise<any>> = {
  '/': () => import('../pages/Home'),
  '/about': () => import('../pages/About'),
  '/portfolio': () => import('../pages/Portfolio'),
  '/contact': () => import('../pages/Contact'),
};

/**
 * Prefetch a route's component
 * @param path - The route path to prefetch
 */
export const prefetchRoute = (path: string): void => {
  const importFunc = routeComponentMap[path];
  if (importFunc) {
    // Start loading the chunk in the background
    importFunc().catch(err => {
      // Silently catch errors during prefetching
      console.debug(`Failed to prefetch route ${path}:`, err);
    });
  }
};

/**
 * Prefetch multiple routes at once
 * @param paths - Array of route paths to prefetch
 */
export const prefetchRoutes = (paths: string[]): void => {
  paths.forEach(path => prefetchRoute(path));
};

/**
 * Prefetch all available routes
 */
export const prefetchAllRoutes = (): void => {
  Object.keys(routeComponentMap).forEach(prefetchRoute);
};
