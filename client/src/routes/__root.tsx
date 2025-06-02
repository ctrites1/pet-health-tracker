import { userQueryOptions } from '@/lib/api';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';

interface MyRouterContext {
  queryClient: QueryClient;
}

function NavBar() {
  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-8">
            <img
              src="/petfolio-logo.svg"
              alt="Petfolio Logo"
              className="w-10 h-10 bg-white rounded-full p-1"
            />
            <h2 className="text-2xl font-bold">
              <Link to="/" className="text-white hover:text-logo-green">
                Petfolio
              </Link>
            </h2>

            <h2 className="text-xl font-normal">
              <Link to="/profile" className="text-white hover:text-logo-green">
                Profile
              </Link>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/api/logout"
              className="px-4 py-2 rounded-md text-white hover:bg-logo-green transition-colors duration-200"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Root() {
  const { user } = Route.useRouteContext();

  return (
    <>
      {user && <NavBar />}
      <hr />
      <Outlet />
    </>
  );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (e) {
      console.error(e);
      return { user: null };
    }
  },
  component: Root,
  notFoundComponent: () => {
    return <p>This page doesn't exist!</p>;
  },
});
