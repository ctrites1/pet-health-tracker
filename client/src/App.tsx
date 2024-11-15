import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { ScrollArea } from "./components/ui/scroll-area";

export default function App() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="border-b">
				<div className="flex h-16 items-center px-4">
					<h2 className="text-2xl font-bold">PetCare Tracker</h2>
					<nav className="mx-6 flex items-center space-x-4">
						<Button variant="ghost">My Pets</Button>
						<Button variant="ghost">Health Records</Button>
						<Button variant="ghost">Calendar</Button>
					</nav>
					<div className="ml-auto flex items-center space-x-4">
						{/* <UserButton /> */}
					</div>
				</div>
			</header>

			<main className="flex-1 space-y-4 p-8 pt-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{/* Cards for pet summary */}
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

				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Events</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[300px]">{/* Event list */}</ScrollArea>
						</CardContent>
					</Card>

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
			</main>
		</div>
	);
}
