import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/pets/new")({
	component: NewPet,
});

function NewPet() {
	const [preview] = useState<string | null>(null);
	const form = useForm({
		defaultValues: {
			name: "",
			species: "",
			breed: "",
			dateOfBirth: "",
			weight: 0,
			imageUrl: "",
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log(value);
		},
	});

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-3xl font-semibold mb-6">Add a New Pet</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<div className="flex justify-center mb-6">
					<div className="w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden">
						{preview ? (
							<img
								src={preview}
								alt="Pet preview"
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-gray-400">Pet Photo</span>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<form.Field
							name="name"
							children={(field) => {
								return (
									<>
										<Label
											htmlFor={field.name}
											className="block text-sm font-medium mb-2"
										>
											Pet Name *
										</Label>
										<Input
											id={field.name}
											name={field.name}
											value={String(field.state.value)}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.isTouched &&
										field.state.meta.errors.length ? (
											<em>{field.state.meta.errors.join(", ")}</em>
										) : null}
									</>
								);
							}}
						/>
					</div>

					<div>
						<form.Field
							name="species"
							children={(field) => {
								return (
									<>
										<Label
											htmlFor={field.name}
											className="block text-sm font-medium mb-2"
										>
											Species *
										</Label>
										<Select
											value={String(field.state.value)}
											onValueChange={(value) => field.handleChange(value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select species" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="dog">Dog</SelectItem>
												<SelectItem value="cat">Cat</SelectItem>
												<SelectItem value="rabbit">Rabbit</SelectItem>
												<SelectItem value="bird">Bird</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>

										{field.state.meta.isTouched &&
										field.state.meta.errors.length ? (
											<em>{field.state.meta.errors.join(", ")}</em>
										) : null}
									</>
								);
							}}
						/>
					</div>

					<div>
						<form.Field
							name="breed"
							children={(field) => (
								<>
									<Label
										htmlFor={field.name}
										className="block text-sm font-medium mb-2"
									>
										Breed
									</Label>
									<Input
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.isTouched &&
									field.state.meta.errors.length ? (
										<em>{field.state.meta.errors.join(", ")}</em>
									) : null}
								</>
							)}
						/>
					</div>

					<div>
						<form.Field
							name="dateOfBirth"
							children={(field) => (
								<>
									<Label
										htmlFor={field.name}
										className="block text-sm font-medium mb-2"
									>
										Date of Birth
									</Label>
									<Input
										type="date"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.isTouched &&
									field.state.meta.errors.length ? (
										<em>{field.state.meta.errors.join(", ")}</em>
									) : null}{" "}
								</>
							)}
						/>
					</div>

					<div>
						<form.Field
							name="weight"
							children={(field) => (
								<>
									<Label
										htmlFor={field.name}
										className="block text-sm font-medium mb-2"
									>
										Weight (kg)
									</Label>
									<Input
										type="number"
										step="0.01"
										value={field.state.value}
										onChange={(e) => field.handleChange(Number(e.target.value))}
									/>
									{field.state.meta.isTouched &&
									field.state.meta.errors.length ? (
										<em>{field.state.meta.errors.join(", ")}</em>
									) : null}
								</>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<button
						type="button"
						onClick={() => form.reset()}
						className="px-6 py-2 rounded-lg border border-gray-200 bg-gray-50 text-black text-base hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-6 py-2 rounded-lg border border-logo-green-dark bg-logo-green text-white text-base hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
					>
						Add Pet
					</button>
				</div>
			</form>
		</div>
	);
}
