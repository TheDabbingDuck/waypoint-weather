// src/components/Weather/Alerts.jsx
import React from "react";

/**
 * Displays active alerts as a list within a red banner.
 * Expects `data` to be an array of alert feature objects (GeoJSON style).
 * @param {{ data: Array }} props
 */
export default function Alerts({ data }) {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <h2 className="text-lg font-semibold mb-2">Active Alerts</h2>
            <ul className="space-y-4">
                {data.map((alertFeature) => {
                    const {
                        id,
                        title,
                        severity,
                        effective,
                        expires,
                        description,
                        instruction,
                    } = alertFeature.properties;

                    const effTime = new Date(effective).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                    });
                    const expTime = new Date(expires).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                    });

                    return (
                        <li key={id} className="bg-white rounded-md shadow p-3">
                            <h3 className="text-md font-semibold">{title}</h3>
                            <p className="text-sm">
                                <span className="font-medium">Severity:</span> {severity}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Effective:</span> {effTime}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Expires:</span> {expTime}
                            </p>
                            {description && (
                                <p className="mt-1 text-sm text-gray-700">{description}</p>
                            )}
                            {instruction && (
                                <p className="mt-1 text-sm text-gray-700 font-medium">
                                    Instruction: {instruction}
                                </p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
