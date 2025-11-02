'use client';

interface SongMachineProps {
  selectedWarplet: any;
  onStart: () => void;
}

export default function SongMachine({ selectedWarplet, onStart }: SongMachineProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {selectedWarplet ? (
        <>
          <div className="mb-8">
            <img
              src={selectedWarplet.imageUrl}
              alt={selectedWarplet.name}
              className="w-32 h-32 md:w-48 md:h-48 rounded-lg border-4 border-purple-400 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white text-center">{selectedWarplet.name}</h3>
          </div>
          <button
            onClick={onStart}
            className="relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            <span className="relative z-10">START</span>
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75"></div>
          </button>
        </>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Select Your Warplet</h2>
            <p className="text-gray-400">Choose a Warplet to generate music for</p>
          </div>
          <button
            disabled
            className="px-12 py-6 bg-gray-700 text-gray-500 text-2xl font-bold rounded-full cursor-not-allowed"
          >
            START
          </button>
        </>
      )}
    </div>
  );
}

