// src/components/RecentsList.jsx
import React from "react";

/**
 * RecentsList shows up to 5 recent places. Clicking one re‐selects it.
 * Props:
 *   - recents: Array of { placeId, name, lat, lng }
 *   - onSelectRecent: function(place) => void
 */
export default function RecentsList({ recents, onSelectRecent }) {
    if (recents.length === 0) {
        return null;
    }

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
            <ul className="space-y-1">
                {recents.map((place) => (
                    <li key={place.placeId}>
                        <button
                            onClick={() => onSelectRecent(place)}
                            className="w-full text-left text-blue-600 hover:underline focus:outline-none"
                        >
                            {place.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
