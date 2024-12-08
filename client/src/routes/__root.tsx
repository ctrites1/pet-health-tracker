import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

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
						{/* TODO: Implement auth buttons */}
						{/* <div className="flex items-center gap-4">
							<Link
								to="/login"
								className="px-4 py-2 rounded-md text-white hover:bg-logo-green transition-colors duration-200"
							>
								Sign In
							</Link>
							<Link
								to="/register"
								className="px-4 py-2 rounded-md bg-logo-green text-white hover:bg-opacity-90 transition-colors duration-200"
							>
								Register
							</Link>
						</div> */}
					</div>
				</div>

				{/* 
				TODO: Add Auth to navbar
			*/}
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

export const Route = createRootRoute({
	component: Root,
});
