// src/components/MapLoader.jsx
import { useEffect } from "react";

export default function MapLoader({ onLoad }) {
    useEffect(() => {
        const existingScript = document.getElementById("google-maps-script");
        if (existingScript) {
            if (existingScript.getAttribute("data-loaded") === "true") {
                onLoad?.();
            } else {
                existingScript.addEventListener("load", () => {
                    existingScript.setAttribute("data-loaded", "true");
                    onLoad?.();
                });
            }
            return;
        }

        const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!key) {
            console.error("Google Maps API key is missing. Check .env.local.");
            return;
        }

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.setAttribute("data-loaded", "false");
        script.onload = () => {
            script.setAttribute("data-loaded", "true");
            onLoad?.();
        };
        document.head.appendChild(script);
    }, [onLoad]);

    return null;
}
