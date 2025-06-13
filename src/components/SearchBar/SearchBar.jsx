// src/components/SearchBar/SearchBar.jsx
import { useEffect, useRef, useState } from "react";

// Custom debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function SearchBar({ googleLoaded, onSelectPlace }) {
    const containerRef = useRef(null);
    const autocompleteElementRef = useRef(null); // Ref for the Web Component instance
    const [currentInputValue, setCurrentInputValue] = useState("");
    // Using a 750ms delay for a slightly better user experience with typing pauses
    const debouncedInputValue = useDebounce(currentInputValue, 750);

    useEffect(() => {
        if (!googleLoaded || !containerRef.current || autocompleteElementRef.current) {
            // If google is not loaded, or container is not ready, or element already created, do nothing.
            return;
        }

        (async () => {
            try {
                const placesLib = await window.google.maps.importLibrary("places");
                const { PlaceAutocompleteElement } = placesLib;

                const element = new PlaceAutocompleteElement({
                    inputMode: 'input-only', // Take manual control over when predictions are requested
                });
                element.style.width = "100%";
                element.style.boxSizing = "border-box";
                // Consider adding a placeholder via styling the ::part(input) or if the component supports it directly.
                // element.placeholder = "Enter a location"; // This might not be a direct property

                element.addEventListener('input', (event) => {
                    setCurrentInputValue(event.target.value);
                });

                element.addEventListener("gmp-select", async (event) => {
                    try {
                        const prediction = event.placePrediction;
                        const place = prediction.toPlace();
                        await place.fetchFields({
                            fields: ["displayName", "formattedAddress", "location"],
                        });
                        const lat = place.location.lat();
                        const lng = place.location.lng();
                        const displayName = place.displayName || place.formattedAddress || "";
                        onSelectPlace({
                            placeId: prediction.placeId,
                            name: displayName,
                            lat,
                            lng,
                        });
                        // Clear input after selection
                        setCurrentInputValue("");
                        if (autocompleteElementRef.current) {
                            autocompleteElementRef.current.value = "";
                        }
                    } catch (innerErr) {
                        console.error("Error fetching place details:", innerErr);
                    }
                });

                // Clear the container before appending (e.g., if there was a "Loading..." message)
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                    containerRef.current.appendChild(element);
                }
                autocompleteElementRef.current = element;

            } catch (err) {
                console.error("Error initializing PlaceAutocompleteElement:", err);
            }
        })();

    }, [googleLoaded, onSelectPlace]); // Effect runs when googleLoaded or onSelectPlace changes

    // Effect to handle debounced input value changes
    useEffect(() => {
        if (autocompleteElementRef.current && debouncedInputValue !== autocompleteElementRef.current.value) {
            if (debouncedInputValue.trim() !== "") {
                autocompleteElementRef.current.value = debouncedInputValue;
                autocompleteElementRef.current.requestPredictions();
            } else {
                // If the debounced input is empty, clear the autocomplete element's value.
                // The PlaceAutocompleteElement should ideally clear its own suggestions then.
                autocompleteElementRef.current.value = "";
                // If it doesn't clear suggestions, one might need to find a method on the element to do so.
            }
        }
    }, [debouncedInputValue]);

    return (
        <div
            ref={containerRef}
            className={`w-full border rounded ${
                !googleLoaded
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
            }`}
            style={{
                minHeight: "2.5rem", // Ensure space for the input/autocomplete
            }}
        >
            {!googleLoaded && !autocompleteElementRef.current && (
                <div className="px-3 py-2 text-gray-500">
                    Loading Google Maps...
                </div>
            )}
            {/* The PlaceAutocompleteElement is appended here by the useEffect hook */}
        </div>
    );
}
