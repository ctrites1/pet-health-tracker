import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import PetCard from '@/components/PetCard';
import PetCardSkeleton from '@/components/PetCardSkeleton';
import StatsCardSkeleton from '@/components/StatsCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, PawPrint, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

async function getAllPets() {
  const res = await api.pets.$get();
  if (!res.ok) {
    throw new Error('Server Error');
  }
  const data = await res.json();

  return data.pets;
}

async function getSpeciesCount() {
  const res = await api.pets['all-species'].$get();
  if (!res.ok) {
    throw new Error('Server Error');
  }
  const data = await res.json();
  return data;
}

async function getUserData() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error('Server Error');
  }
  const data = await res.json();
  return data.user;
}

function Index() {
  const {
    data: speciesData,
    isPending: isSpeciesPending,
    error: speciesError,
  } = useQuery({
    queryKey: ['species-count'],
    queryFn: getSpeciesCount,
  });

  const {
    data: petsData,
    isPending: isPetsPending,
    error: petsError,
  } = useQuery({
    queryKey: ['pets'],
    queryFn: getAllPets,
  });

  const {
    data: userData,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUserData,
  });

  if (speciesError || petsError || userError) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 p-8">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertDescription className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Something went wrong loading your pet data. Please try refreshing the page.
              <br />
              <span className="text-sm opacity-75">
                {speciesError?.message || petsError?.message || userError?.message}
              </span>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }
  const isLoading = isPetsPending || isSpeciesPending || isUserPending;

  type SpeciesCount = {
    species: string;
    count: number;
  };

  type SpeciesInfo = SpeciesCount & {
    emoji: string;
    label: string;
    displayCount: string;
  };

  type SpeciesConfigData = {
    [key: string]: {
      emoji: string;
      label: string;
    };
  };

  const getSpeciesInfo = (): SpeciesInfo[] => {
    if (!speciesData?.speciesCounts) return [];
    const speciesConfig: SpeciesConfigData = {
      Dog: { emoji: '🐕', label: 'Dogs' },
      Cat: { emoji: '🐈', label: 'Cats' },
      Rabbit: { emoji: '🐇', label: 'Rabbits' },
      Bird: { emoji: '🐦', label: 'Birds' },
      Fish: { emoji: '🐠', label: 'Fish' },
      Other: { emoji: '🐾', label: 'Other Pets' },
    };

    return speciesData.speciesCounts
      .filter((item: SpeciesCount) => item.count > 0)
      .map(
        (item: SpeciesCount): SpeciesInfo => ({
          ...item,
          emoji: speciesConfig[item.species]?.emoji || '🐾',
          label: speciesConfig[item.species]?.label || item.species,
          displayCount: `${item.count} ${item.count === 1 ? 'pet' : 'pets'}`,
        }),
      );
  };

  const totalPets = petsData?.length || 0;
  const speciesInfo = getSpeciesInfo();

  return (
    <div className="page-container">
      <main className="flex-1 p-6 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <PawPrint className="h-8 w-8 text-blue-600" />
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                `${userData?.given_name ? `${userData.given_name}'s` : 'Your'} Pet Dashboard`
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Monitor and track your pets' health and wellbeing
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Pet
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pets</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-gray-900">{totalPets}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pet Types</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-gray-900">{speciesInfo.length}</div>
              )}
            </CardContent>
          </Card>

          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            speciesInfo.slice(0, 2).map(species => (
              <Card
                key={species.species}
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{species.emoji}</div>
                    <h3 className="text-sm font-medium text-gray-600">{species.label}</h3>
                    <p className="text-xl font-bold text-gray-900">{species.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pets Grid Section */}
        <div className="space-y-6 ">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Pets</h2>
            {!isLoading && totalPets > 0 && (
              <p className="text-sm text-gray-500">
                {totalPets} {totalPets === 1 ? 'pet' : 'pets'} total
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PetCardSkeleton key={i} />
              ))}
            </div>
          ) : totalPets === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets yet</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Start your pet health journey by adding your first furry, feathered, or scaled
                  friend!
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Pet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col justify-start sm:flex-row sm:items-center sm:justify-between ">
              {petsData.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>

        {!isLoading && speciesInfo.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pet Types Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {speciesInfo.map(species => (
                <Card
                  key={species.species}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200"
                >
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{species.emoji}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{species.label}</h3>
                      <p className="text-sm text-gray-600">{species.displayCount}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
