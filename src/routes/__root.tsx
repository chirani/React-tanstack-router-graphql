import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Navbar from '../components/Navbar';

const RootLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<{
  queryClient?: QueryClient;
}>()({
  component: RootLayout,
});
