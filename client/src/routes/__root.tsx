import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

function NavBar() {
	return (
		<nav className="bg-gray-800 p-2">
			<div className="container mx-auto">
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
				</div>

				{/* 
				TODO: Add Auth to navbar
			*/}
				{/* <div className="flex items-center space-x-4"> */}
				{/* Auth buttons - you can integrate with Clerk/Kinde here */}
				{/* <button className="text-white hover:text-gray-300">Sign In</button>
				<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
					Sign Up
				</button>
			</div> */}
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
