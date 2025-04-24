import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@server": path.resolve(__dirname, "../server"),
			server: path.resolve(__dirname, "../server"),
			"@shared": path.resolve(__dirname, "../shared"),
			shared: path.resolve(__dirname, "../shared"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	build: {
		rollupOptions: {
			external: ["@shared/types/petEnums"],
		},
	},
});
