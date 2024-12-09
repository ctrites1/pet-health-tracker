import { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	Link,
	Outlet,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
	queryClient: QueryClient;
}

function NavBar() {
	return (
		<nav className="bg-gray-800 p-2">
			<div className="container mx-auto">
				<div className="flex items-center justify-between">
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

						<h2 className="text-xl font-bold">
							<Link to="/pets/new" className="text-white hover:text-logo-green">
								+Pet
							</Link>
						</h2>
						<h2 className="text-xl font-bold">
							<Link to="/profile" className="text-white hover:text-logo-green">
								Profile
							</Link>
						</h2>
						{/* TODO: Implement auth buttons with logout button option if someone is logged in */}
						<div className="flex items-center gap-4">
							<a
								href="/api/login"
								className="px-4 py-2 rounded-md text-white hover:bg-logo-green transition-colors duration-200"
							>
								Sign In
							</a>
							<a
								href="/api/register"
								className="px-4 py-2 rounded-md bg-logo-green-dark text-white hover:bg-opacity-80 transition-colors duration-200"
							>
								Register
							</a>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

function Root() {
	return (
		<>
			<NavBar />
			<hr />
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root,
});
