// src/components/FavoritesDropdown.jsx
import React, { useState, useRef, useEffect } from "react";

/**
 * FavoritesDropdown displays a star icon that toggles a dropdown menu.
 * Props:
 *   - favorites: Array of { placeId, name, lat, lng }
 *   - onSelectFavorite: function(place) => void
 *   - onAddFavorite: function() => void
 *   - onRemoveFavorite: function(placeId) => void
 */
export default function FavoritesDropdown({
                                              favorites,
                                              onSelectFavorite,
                                              onAddFavorite,
                                              onRemoveFavorite,
                                          }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {/* Star Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                aria-label="Favorites"
            >
                ★
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-20">
                    <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Favorites</span>
                        <button
                            onClick={() => {
                                onAddFavorite();
                            }}
                            className="text-blue-500 text-sm hover:underline focus:outline-none"
                        >
                            Add
                        </button>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="p-4 text-gray-500">No favorites yet.</div>
                    ) : (
                        <ul className="max-h-48 overflow-y-auto">
                            {favorites.map((fav) => (
                                <li
                                    key={fav.placeId}
                                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
                                >
                                    {/* Clicking the name selects the favorite */}
                                    <button
                                        onClick={() => {
                                            onSelectFavorite(fav);
                                            setOpen(false);
                                        }}
                                        className="text-left text-gray-800 flex-1 focus:outline-none"
                                    >
                                        {fav.name}
                                    </button>

                                    {/* Remove button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFavorite(fav.placeId);
                                        }}
                                        className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                                        aria-label={`Remove ${fav.name}`}
                                    >
                                        ✕
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
