"use client";

import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [name, setName] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (name.trim() === "") {
            alert("Please enter a food item name.");
            return;
        }

        onSearch(name);
        setName("");
    };

    return (
        <div>
            <form className="w-3/12 mx-auto space-y-4" onSubmit={handleSubmit}>
                <label>
                    <input
                        className="text-black p-2 w-full h-12 rounded-xl ring ring-gray-300"
                        placeholder="Enter a food item name for the nutritional information"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </label>
                <div className="w-full">
                    <button
                        className="hover:bg-purple-400 text-white font-bold h-12 w-full rounded-xl bg-purple-500 ring-gray-300"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}