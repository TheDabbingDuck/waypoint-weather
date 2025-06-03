// src/components/App.jsx
import { useState } from "react";
import MapLoader from "./MapLoader";
import SearchBar from "./SearchBar/SearchBar";

export default function App() {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelect = ({ placeId, name, lat, lng }) => {
    console.log("User selected:", { placeId, name, lat, lng });
    setSelectedPlace({ placeId, name, lat, lng });
    // In 13.3 / 13.4 we’ll hook this into the weather‐fetch logic
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* 1. Inject Google Maps script and flip googleLoaded on load */}
        <MapLoader onLoad={() => setGoogleLoaded(true)} />

        {/* 2. Navbar area */}
        <header className="bg-white shadow-md fixed top-0 w-full z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center space-x-4">
            <h1 className="text-xl font-semibold">WaypointWeather</h1>
            <div className="flex-1">
              <SearchBar googleLoaded={googleLoaded} onSelectPlace={handlePlaceSelect} />
            </div>
          </div>
        </header>

        {/* 3. Main content */}
        <main className="pt-20 max-w-4xl mx-auto px-4">
          {!selectedPlace ? (
              <div className="mt-10 text-center text-gray-600">
                Search for a location above to see its weather.
              </div>
          ) : (
              <div className="mt-10">
                <p className="text-gray-700">
                  You selected: <span className="font-medium">{selectedPlace.name}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Lat: {selectedPlace.lat.toFixed(4)}, Lng: {selectedPlace.lng.toFixed(4)}
                </p>
                {/* Placeholder for WeatherDetails once we implement 13.4 */}
              </div>
          )}
        </main>
      </div>
  );
}
