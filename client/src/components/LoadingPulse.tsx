import { PuffLoader } from 'react-spinners';

export default function LoadingPulse() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <PuffLoader color="#3B82F6" size={80} />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
