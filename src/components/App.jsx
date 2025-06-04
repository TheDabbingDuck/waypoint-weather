// src/components/App.jsx
import React, {useState} from "react";
import MapLoader from "./MapLoader";
import SearchBar from "./SearchBar/SearchBar";
import FavoritesDropdown from "./FavoritesDropdown";
import WeatherDetails from "./Weather/WeatherDetails";

export default function App() {
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const handlePlaceSelect = ({placeId, name, lat, lng}) => {
        // Update state when the user picks a place via SearchBar
        setSelectedPlace({placeId, name, lat, lng});
    };

    return (<div className="min-h-screen bg-gray-50">
        {/* 1. Inject Google Maps script; onLoad flips googleLoaded to true */}
        <MapLoader onLoad={() => setGoogleLoaded(true)}/>

        {/* 2. Fixed header with title, SearchBar, and placeholder FavoritesDropdown */}
        <header className="bg-white shadow-md fixed top-0 w-full z-10">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center space-x-4">
                {/* App Title */}
                <h1 className="text-xl font-semibold">WaypointWeather</h1>

                {/* Search input (disabled until googleLoaded === true) */}
                <div className="flex-1">
                    <SearchBar
                        googleLoaded={googleLoaded}
                        onSelectPlace={handlePlaceSelect}
                    />
                </div>

                {/* Placeholder for Favorites (disabled for now) */}
                <FavoritesDropdown/>
            </div>
        </header>

        {/* 3. Main content area, pushed below the fixed header */}
        <main className="pt-20 max-w-4xl mx-auto px-4">
            {!selectedPlace ? (<div className="mt-10 text-center text-gray-600">
                Search for a location above to see its weather.
            </div>) : (<div className="mt-10">
                {/* Render the full WeatherDetails component */}
                <WeatherDetails place={selectedPlace}/>
            </div>)}
        </main>
    </div>);
}
