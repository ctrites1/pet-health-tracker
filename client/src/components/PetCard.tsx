import { CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link } from '@tanstack/react-router';

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  weight: number;
  ownerId: number;
  imageUrl: string;
}
export default function PetCard({ pet }: { pet: Pet }) {
  const calculateAge = (birthDate: string) => {
    const years = Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 31536000000);
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  };

  return (
    <div className="max-w-xs w-full group/card m-2">
      <div className="relative overflow-hidden bg-white/80 rounded-lg shadow-md h-full transition-transform duration-300 group-hover/card:scale-[1.02]">
        <Link
          to="/pets/$petId"
          params={{ petId: pet.id.toString() }}
          className="block cursor-pointer"
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-slate-800 opacity-0 group-hover/card:opacity-70 z-5"></div>

          <CardContent className="pt-4 relative">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4 text-center place-content-center bg-gray-100 rounded-full relative z-10">
                <AvatarImage src={pet.imageUrl} />
                <AvatarFallback>{pet.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2 relative z-20 transition-colors group-hover/card:text-white">
                {pet.name}
              </h3>
              <div className="text-sm text-muted-foreground space-y-1 text-center relative z-20 transition-colors group-hover/card:text-gray-200">
                <p>Species: {pet.species}</p>
                <p>Age: {calculateAge(pet.dateOfBirth)}</p>
              </div>
            </div>
          </CardContent>
        </Link>
      </div>
    </div>
  );
}
