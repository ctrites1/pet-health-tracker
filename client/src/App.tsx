import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { ScrollArea } from "./components/ui/scroll-area";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Separator } from "./components/ui/separator";

export default function App() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} md:relative md:translate-x-0`}
			>
				<div className="flex flex-col h-full">
					<div className="p-4 border-b">
						<div className="flex items-center space-x-3">
							<img
								src="/pet-logo.svg"
								alt="Petfolio Logo"
								className="w-8 h-8"
							/>
							<h2 className="text-2xl font-bold">Petfolio</h2>
						</div>
					</div>
					<nav className="flex flex-col p-4">
						<Button variant="ghost" className="justify-start text-lg h-12 mb-2">
							My Pets
						</Button>
						<Button variant="ghost" className="justify-start text-lg h-12 mb-2">
							Health Records
						</Button>
						<Button variant="ghost" className="justify-start text-lg h-12">
							Calendar
						</Button>
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-h-screen">
				<header className="border-b">
					<div className="flex h-16 items-center px-4">
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						>
							<Menu className="h-6 w-6" />
						</Button>
					</div>
				</header>
				<main className="flex-1 p-8 pt-6">
					<div className="space-y-4">
						<h2 className="text-2xl font-bold mb-6">Pets</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{/* Pet Card */}
							<Card>
								<CardHeader>
									<CardTitle>Max</CardTitle>
								</CardHeader>
								<CardContent className="flex items-center space-x-4">
									<Avatar className="h-20 w-20">
										<AvatarImage src="/pets/max.jpg" />
										<AvatarFallback>MX</AvatarFallback>
									</Avatar>
									<div>
										<p>Next checkup: Dec 15</p>
										<p>Medications: 2</p>
									</div>
								</CardContent>
							</Card>
							{/* More pet cards */}
						</div>

						<Separator className="my-8" />

						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Health Reminders</CardTitle>
								</CardHeader>
								<CardContent>
									<ScrollArea className="h-[300px]">
										{/* Reminders list */}
									</ScrollArea>
								</CardContent>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
