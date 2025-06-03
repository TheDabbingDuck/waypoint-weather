// src/components/SearchBar/SearchBar.jsx
import { useEffect, useRef, useState } from "react";

export default function SearchBar({ googleLoaded, onSelectPlace }) {
    // We’ll attach the PlaceAutocompleteElement into this div.
    const containerRef = useRef(null);
    const [autocompleteElement, setAutocompleteElement] = useState(null);

    useEffect(() => {
        if (!googleLoaded || autocompleteElement) return;

        // Wrap in an async IIFE so we can await importLibrary
        (async () => {
            try {
                // Import the "places" library to get PlaceAutocompleteElement
                const placesLib = await window.google.maps.importLibrary("places");
                const { PlaceAutocompleteElement } = placesLib;

                // Create a new PlaceAutocompleteElement (Web Component)
                const element = new PlaceAutocompleteElement();

                // (Optional) You can tweak styling on the element itself—
                // e.g., element.style.width = "100%"; to make it full-width.
                element.style.width = "100%";
                element.style.boxSizing = "border-box";

                // Append it into our container <div>
                if (containerRef.current) {
                    containerRef.current.appendChild(element);
                }

                // Listen for a place being selected via "gmp-select"
                element.addEventListener("gmp-select", async (event) => {
                    try {
                        const prediction = event.placePrediction;
                        // Convert prediction to a Place object
                        const place = prediction.toPlace();

                        // Fetch exactly the fields we need
                        await place.fetchFields({
                            fields: ["displayName", "formattedAddress", "location"],
                        });

                        const lat = place.location.lat();
                        const lng = place.location.lng();
                        const displayName =
                            place.displayName || place.formattedAddress || "";

                        onSelectPlace({
                            placeId: prediction.placeId,
                            name: displayName,
                            lat,
                            lng,
                        });
                    } catch (innerErr) {
                        console.error("Error fetching place details:", innerErr);
                    }
                });

                setAutocompleteElement(element);
            } catch (err) {
                console.error(
                    "Error initializing PlaceAutocompleteElement:",
                    err
                );
            }
        })();
    }, [googleLoaded, autocompleteElement, onSelectPlace]);

    return (
        <div
            ref={containerRef}
            className={`w-full border rounded ${
                !googleLoaded
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
            }`}
            style={{
                minHeight: "2.5rem", // ensure there’s vertical space for the web component
            }}
        >
            {!googleLoaded && (
                <div className="px-3 py-2 text-gray-500">
                    Loading Google Maps...
                </div>
            )}
            {/* Once googleLoaded & autocompleteElement are set, the actual <gmp-place-autocomplete>
          will be appended under this div automatically. */}
        </div>
    );
}
