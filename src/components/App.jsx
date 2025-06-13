// src/components/App.jsx
import React, {useState, useEffect} from "react";
import MapLoader from "./MapLoader";
import SearchBar from "./SearchBar/SearchBar";
import FavoritesDropdown from "./FavoritesDropdown";
import RecentsList from "./RecentsList";
import WeatherDetails from "./Weather/WeatherDetails";

export default function App() {
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [recents, setRecents] = useState([]);
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem("waypointFavorites");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {
            console.warn("Could not parse stored favorites:", e);
        }
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem("waypointFavorites", JSON.stringify(favorites));
        } catch (e) {
            console.error("Failed to save favorites to localStorage:", e);
        }
    }, [favorites]);

    const handleClearSelectedPlace = () => {
        setSelectedPlace(null);
    };

    const handlePlaceSelect = ({placeId, name, lat, lng}) => {
        const place = {placeId, name, lat, lng};
        setSelectedPlace(place);
        setRecents((prev) => {
            const filtered = prev.filter((p) => p.placeId !== placeId);
            const newList = [place, ...filtered];
            return newList.slice(0, 5);
        });
    };

    const handleAddFavorite = () => {
        if (selectedPlace && !favorites.some((f) => f.placeId === selectedPlace.placeId)) {
            setFavorites((prev) => [...prev, selectedPlace]);
        }
    };

    const handleRemoveFavorite = (placeId) => {
        setFavorites((prev) => prev.filter((f) => f.placeId !== placeId));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 1. Load Google Maps */}
            <MapLoader onLoad={() => setGoogleLoaded(true)}/>

            {/* 2. Fixed Header */}
            <header className="bg-white shadow-lg sticky top-0 w-full z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4">
                        {/* Title - Clickable to clear selection */}
                        <button onClick={handleClearSelectedPlace} className="focus:outline-none">
                            <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-150 cursor-pointer">
                                WaypointWeather
                            </h1>
                        </button>

                        {/* Search and Favorites */}
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center sm:space-x-4 mt-3 sm:mt-0">
                            <div className="w-full sm:max-w-xs lg:max-w-sm mb-2 sm:mb-0">
                                <SearchBar
                                    googleLoaded={googleLoaded}
                                    onSelectPlace={handlePlaceSelect}
                                />
                            </div>
                            <FavoritesDropdown
                                favorites={favorites}
                                selectedPlace={selectedPlace} // Pass selectedPlace
                                onSelectFavorite={handlePlaceSelect} // Changed from handleSelectFavorite
                                onAddFavorite={handleAddFavorite}
                                onRemoveFavorite={handleRemoveFavorite}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. Main Content */}
            <main className="flex-grow pt-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {!selectedPlace ? (
                    <div className="mt-12 text-center text-gray-700 p-8 sm:p-12 bg-white rounded-xl shadow-xl flex flex-col items-center">
                        <img
                            src={`${process.env.PUBLIC_URL}/weather-icons/partly-cloudy-day.svg`}
                            alt="Weather illustration"
                            className="w-32 h-32 sm:w-40 sm:h-40 mb-6 text-blue-500 opacity-80"
                        />
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Welcome to WaypointWeather!</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-md">
                            Use the search bar above to find a location and get the latest weather updates, hourly forecasts, and more.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        <WeatherDetails place={selectedPlace}/>
                        {recents.length > 0 && (
                            <RecentsList
                                recents={recents}
                                onSelectRecent={handlePlaceSelect}
                            />
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white py-4 sm:py-5 text-center text-gray-500 text-sm border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p>&copy; {new Date().getFullYear()} WaypointWeather. Powered by NWS & Google Maps Places API.</p>
                </div>
            </footer>
        </div>
    );
}
