import { createFileRoute, Outlet } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/api";
import { useState } from "react";
import { api } from "@/lib/api";

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await api.login.$get();
			if (response.ok) {
				const loginUrl = await response.text();
				window.location.href = loginUrl;
			} else {
				console.error("Failed to get login URL");
			}
		} catch (error) {
			console.error("Login error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
				<div className="flex justify-center mb-6">
					<img
						src="/petfolio-logo.svg"
						alt="Petfolio logo"
						className="h-16 w-auto"
					/>
				</div>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Petfolio</h1>
					<p className="text-gray-600">
						Keep track of your pets' health records, medications, and
						appointments
					</p>
				</div>

				<div className="space-y-4">
					<a
						href="#"
						onClick={handleLogin}
						className="w-full bg-logo-green hover:bg-logo-green-dark text-white py-2 px-4 rounded text-center block"
					>
						{isLoading ? "Redirecting..." : "Sign in to your account"}
					</a>

					<a
						href="#"
						onClick={(e) => {
							e.preventDefault();
							api.register.$get().then(async (res) => {
								if (res.ok) {
									const url = await res.text();
									window.location.href = url;
								}
							});
						}}
						className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded text-center block"
					>
						Create account
					</a>
				</div>
			</div>
		</div>
	);
};

const Component = () => {
	const { user } = Route.useRouteContext();
	if (!user) {
		return <Login />;
	}

	return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
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
	component: Component,
});
