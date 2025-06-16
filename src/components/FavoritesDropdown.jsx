// src/components/FavoritesDropdown.jsx
import React, {useState, useRef, useEffect} from "react";

export default function FavoritesDropdown({
                                              favorites,
                                              selectedPlace, // Added selectedPlace prop
                                              onSelectFavorite,
                                              onAddFavorite,
                                              onRemoveFavorite,
                                          }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isCurrentPlaceFavorite = selectedPlace && favorites.some(fav => fav.placeId === selectedPlace.placeId);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center px-3 py-2 bg-white text-sky-700 rounded-md hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-colors duration-150 shadow hover:shadow-md"
                aria-label="Toggle Favorites Menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.846 5.671a1 1 0 00.95.69h5.969c.969 0 1.371 1.24.588 1.81l-4.827 3.522a1 1 0 00-.364 1.118l1.846 5.671c.3.921-.755 1.688-1.54 1.118l-4.827-3.522a1 1 0 00-1.175 0l-4.827 3.522c-.784.57-1.838-.197-1.539-1.118l1.846-5.671a1 1 0 00-.364-1.118L2.253 11.1c-.783-.57-.38-1.81.588-1.81h5.969a1 1 0 00.95-.69L11.049 2.927z" />
                </svg>
                <span className="font-medium text-sm sm:text-base">Favorites</span>
            </button>

            {open && (
                <div
                    className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20 origin-top left-1/2 transform -translate-x-1/2 sm:w-72 sm:origin-top-right sm:left-auto sm:right-0 sm:transform-none"
                >
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">My Favorites</h3>
                        {selectedPlace && (
                            <button
                                onClick={() => {
                                    if (isCurrentPlaceFavorite) {
                                        onRemoveFavorite(selectedPlace.placeId);
                                    } else {
                                        onAddFavorite();
                                    }
                                }}
                                className={`px-3 py-1 text-xs font-medium rounded-md focus:outline-none focus:ring-2 transition-colors duration-150 
                                            ${isCurrentPlaceFavorite 
                                                ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300' 
                                                : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300'}`}
                            >
                                {isCurrentPlaceFavorite ? 'Remove Current' : 'Add Current'}
                            </button>
                        )}
                    </div>

                    {favorites.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <p>No favorite locations yet.</p>
                            <p className="text-xs mt-1">Search for a place and click "Add Current" to save it.</p>
                        </div>
                    ) : (
                        <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                            {favorites.map((fav) => (
                                <li
                                    key={fav.placeId}
                                    className="group flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-100"
                                >
                                    <button
                                        onClick={() => {
                                            onSelectFavorite(fav);
                                            setOpen(false);
                                        }}
                                        className={`text-left text-sm flex-1 focus:outline-none truncate 
                                                    ${selectedPlace && selectedPlace.placeId === fav.placeId 
                                                        ? 'text-blue-600 font-semibold' 
                                                        : 'text-gray-700 group-hover:text-blue-600'}`}
                                        title={fav.name}
                                    >
                                        {fav.name}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFavorite(fav.placeId);
                                        }}
                                        className="ml-3 p-1 text-gray-400 hover:text-red-500 focus:outline-none rounded-full hover:bg-red-100 transition-colors duration-150"
                                        aria-label={`Remove ${fav.name}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
