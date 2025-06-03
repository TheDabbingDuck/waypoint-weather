// components/SearchBar/SearchBar.jsx
import { useEffect, useRef, useState } from "react";

export default function SearchBar({ onSelectPlace }) {
    const inputRef = useRef(null);
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        if (!window.google || !window.google.maps) return;
        if (autocomplete) return;

        const auto = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["geocode", "establishment"], // restrict to POIs/addresses
            componentRestrictions: { country: "us" },
        });
        auto.setFields(["place_id", "formatted_address", "geometry", "name"]);
        auto.addListener("place_changed", () => {
            const place = auto.getPlace();
            if (!place.geometry) {
                console.warn("No geometry for selected place");
                return;
            }
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const displayName = place.name || place.formatted_address;
            onSelectPlace({ placeId: place.place_id, name: displayName, lat, lng });
        });
        setAutocomplete(auto);
    }, [onSelectPlace, autocomplete]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Search for a place (e.g., Space Needle)"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
}
