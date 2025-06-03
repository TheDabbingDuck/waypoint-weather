// hooks/useFavorites.js
import { useState, useEffect } from "react";

export function useFavorites() {
    const STORAGE_KEY = "waypointWeather.favorites";
    const [favorites, setFavorites] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                setFavorites(JSON.parse(raw));
            }
        } catch {
            setFavorites([]);
        }
    }, []);

    // Write to localStorage whenever favorites change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch {
            // Optionally, display a warning if quota is exceeded
            console.warn("Unable to save favorites. LocalStorage quota exceeded?");
        }
    }, [favorites]);

    function addFavorite(location) {
        setFavorites(prev => {
            if (prev.some(item => item.placeId === location.placeId)) {
                return prev;
            }
            return [...prev, location];
        });
    }

    function removeFavorite(placeId) {
        setFavorites(prev => prev.filter(item => item.placeId !== placeId));
    }

    function clearFavorites() {
        setFavorites([]);
        localStorage.removeItem(STORAGE_KEY);
    }

    return { favorites, addFavorite, removeFavorite, clearFavorites };
}
