// src/components/App.jsx
import React, { useState, useEffect } from "react";
import MapLoader from "./MapLoader";
import SearchBar from "./SearchBar/SearchBar";
import FavoritesDropdown from "./FavoritesDropdown";
import RecentsList from "./RecentsList";
import WeatherDetails from "./Weather/WeatherDetails";

export default function App() {
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    // RECENTS (session-only)
    const [recents, setRecents] = useState([]);

    // FAVORITES: initialize from localStorage (or [] if none)
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem("waypointFavorites");
            console.log("Initialize favorites from localStorage:", stored);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("Could not parse stored favorites:", e);
        }
        return [];
    });

    // Whenever favorites change, persist them
    useEffect(() => {
        try {
            localStorage.setItem("waypointFavorites", JSON.stringify(favorites));
            console.log("Saved favorites to localStorage:", favorites);
        } catch (e) {
            console.error("Failed to save favorites to localStorage:", e);
        }
    }, [favorites]);

    // Called whenever a place is chosen (from search, recents, or favorites)
    const handlePlaceSelect = ({ placeId, name, lat, lng }) => {
        const place = { placeId, name, lat, lng };
        setSelectedPlace(place);

        // Update recents (prepend, dedupe, cap at 5)
        setRecents((prev) => {
            const filtered = prev.filter((p) => p.placeId !== placeId);
            const newList = [place, ...filtered];
            return newList.slice(0, 5);
        });
    };

    // Add current selectedPlace to favorites if not already in list
    const handleAddFavorite = () => {
        if (
            selectedPlace &&
            !favorites.some((f) => f.placeId === selectedPlace.placeId)
        ) {
            setFavorites((prev) => [...prev, selectedPlace]);
        }
    };

    // Remove a favorite by placeId
    const handleRemoveFavorite = (placeId) => {
        setFavorites((prev) => prev.filter((f) => f.placeId !== placeId));
    };

    // When a favorite is clicked
    const handleSelectFavorite = (place) => {
        handlePlaceSelect(place);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 1. Load Google Maps */}
            <MapLoader onLoad={() => setGoogleLoaded(true)} />

            {/* 2. Fixed Header */}
            <header className="bg-white shadow-md fixed top-0 w-full z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center space-x-4">
                    <h1 className="text-xl font-semibold">WaypointWeather</h1>

                    {/* Search Input */}
                    <div className="flex-1">
                        <SearchBar
                            googleLoaded={googleLoaded}
                            onSelectPlace={handlePlaceSelect}
                        />
                    </div>

                    {/* Favorites Dropdown */}
                    <FavoritesDropdown
                        favorites={favorites}
                        onSelectFavorite={handleSelectFavorite}
                        onAddFavorite={handleAddFavorite}
                        onRemoveFavorite={handleRemoveFavorite}
                    />
                </div>
            </header>

            {/* 3. Main Content */}
            <main className="pt-20 max-w-4xl mx-auto px-4 space-y-6">
                {!selectedPlace ? (
                    <div className="mt-10 text-center text-gray-600">
                        Search for a location above to see its weather.
                    </div>
                ) : (
                    <>
                        <WeatherDetails place={selectedPlace} />
                        <RecentsList
                            recents={recents}
                            onSelectRecent={handlePlaceSelect}
                        />
                    </>
                )}
            </main>
        </div>
    );
}
