// src/components/Shared/ErrorBanner.jsx
import React from "react";

/**
 * Displays a red banner with an error message and optional retry button.
 * @param {{ message: string, onRetry?: () => void }} props
 */
export default function ErrorBanner({ message, onRetry }) {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
            <div className="flex items-center justify-between">
                <p className="mr-4">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}
