import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/Toast';

const RootLayout = () => (
  <>
    <HeadContent />
    <ToastContainer />
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
