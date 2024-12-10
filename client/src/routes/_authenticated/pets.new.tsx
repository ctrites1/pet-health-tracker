import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { PetSpecies } from "@shared/types/petEnum";
import { createPetSchema } from "@server/sharedTypes";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/pets/new")({
	component: NewPet,
});

function NewPet() {
	const [preview] = useState<string | null>(null);
	const navigate = useNavigate();

	const addPetMutation = useMutation({
		mutationFn: async (petData: typeof createPetSchema._type) => {
			const formattedData = {
				...petData,
				weight: petData.weight ? Number(petData.weight) : null,
			};

			const res = await fetch("/api/pets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formattedData),
			});

			if (!res.ok) {
				const error = await res.json();
				console.log("Server error details:", error); // Error handling
				throw new Error(error.message || "Failed to add pet");
			}

			return res.json();
		},
		onSuccess: () => {
			navigate({ to: "/" });
		},
	});

	const form = useForm({
		validatorAdapter: zodValidator(),
		defaultValues: {
			name: "",
			species: "",
			breed: "",
			dateOfBirth: "",
			weight: 0,
			imageUrl: null,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
			try {
				await addPetMutation.mutateAsync(value);
			} catch (e) {
				console.error("Failed to add pet: ", e);
			}
		},
	});

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const isValid = await form.validate("submit");
			if (!isValid) return;

			form.handleSubmit();
		},
		[form]
	);

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-3xl font-semibold mb-6">Add a New Pet</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
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
							validators={{
								onChange: createPetSchema.shape.name,
							}}
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
							validators={{ onChange: createPetSchema.shape.species }}
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
												{Object.values(PetSpecies).map((species) => (
													<SelectItem key={species} value={species}>
														{species}
													</SelectItem>
												))}
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
							validators={{ onChange: createPetSchema.shape.breed }}
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
							validators={{ onChange: createPetSchema.shape.dateOfBirth }}
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
							validators={{ onChange: createPetSchema.shape.weight }}
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
					{addPetMutation.error && (
						<div className="text-red-500 mb-4">
							{addPetMutation.error.message}
						</div>
					)}
				</div>

				<div className="flex justify-end gap-4">
					<button
						type="button"
						onClick={() => form.reset()}
						className="px-6 py-2 rounded-lg border border-gray-200 bg-gray-50 text-black text-base hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
						disabled={addPetMutation.isPending}
					>
						Cancel
					</button>
					<button
						type="submit"
						onClick={() => form.handleSubmit()}
						className={`
							px-6 py-2 rounded-lg border
							${
								addPetMutation.isPending
									? "border-gray-300 bg-gray-100 text-gray-500"
									: "border-logo-green bg-logo-green text-white"
							}
							text-base 
							hover:not:disabled:-translate-y-1 
							transform transition duration-200 
							hover:not:disabled:shadow-md 
							disabled:opacity-50 
							disabled:cursor-not-allowed
							disabled:hover:transform-none
						  `}
						disabled={addPetMutation.isPending}
					>
						{addPetMutation.isPending ? "Adding Pet..." : "Add Pet"}
					</button>
				</div>
			</form>
		</div>
	);
}
