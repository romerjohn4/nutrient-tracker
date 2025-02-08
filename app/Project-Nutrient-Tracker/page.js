"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Page() {
    const [foodData, setFoodData] = useState(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Function to fetch food data from the OpenFoodFacts API
    const getFoodData = async (query, type) => {
        try {
            setError("");
            setFoodData([]);
            setSearchQuery(query);

            let url;
            if (type === "barcode") {
                url = `https://world.openfoodfacts.org/api/v0/product/${query}.json`;
            } else {
                url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.products && data.products.length > 0) {
                setFoodData(data.products);
            } else {
                setError("No products found. Please try again.");
            }
        } catch (err) {
            console.error("Error fetching food data:", err);
            setError("An error occurred. Please try again.");
        }
    };

    // Function to add a product to the MySQL database
    const addToDatabase = async (product) => {
        try {
            const response = await fetch("http://localhost:5000/api/nutrients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: product.product_name || "Unknown Food",
                    calories: product.nutriments["energy-kcal_100g"] || 0,
                    protein: product.nutriments.proteins_100g || 0,
                    carbs: product.nutriments.carbohydrates_100g || 0,
                    fats: product.nutriments.fat_100g || 0,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add item to the database.");
            }

            const data = await response.json();
            alert(`Added "${data.name}" to the database!`);
        } catch (err) {
            console.error("Error adding item to the database:", err);
            alert("Failed to add item to the database.");
        }
    };

    // Function to clear the database
    const clearDatabase = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/nutrients", {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to clear the database.");
            }

            const data = await response.json();
            alert(data.message); // Show a success message
        } catch (err) {
            console.error("Error clearing the database:", err);
            alert("Failed to clear the database.");
        }
    };

    return (
        <div className="mt-4">
            <div className="flex items-center justify-center">
                <h1 className="ml-4 text-4xl font-bold mb-2 underline text-purple-300">Nutrient Checker Application</h1>
            </div>
            <div className="flex items-center justify-center ">
                <p className="ml-4 text-4xl font-bold text-purple-300 mb-12">Check the nutrients of your meals and snacks and see what kind of nutrients there is!</p>
            </div>
            <div>
                <SearchBar onSearch={getFoodData} />
            </div>
            {/* Add the "Clear Database" button */}
            <button
                className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={clearDatabase}
            >
                Clear Database
            </button>
            {error && <p className="text-red-500 ml-4">{error}</p>}
            {foodData && foodData.length > 0 && (
                <div className="ml-4 mt-6">
                    <h2 className="text-2xl font-lg text-purple-300">Results Or Similar For {searchQuery}:</h2>
                    <p className="font-bold">Scroll down for more options!</p>
                    <div className="space-y-6">
                        {foodData.map((product, index) => (
                            <div key={index} className="mt-4">
                                <h3 className="text-xl font-bold">{product.product_name || "Unknown Food"}</h3>
                                {product.image_url && (
                                    <img
                                        src={product.image_url}
                                        alt={product.product_name}
                                        className="mt-4 max-w-xs rounded-lg"
                                    />
                                )}
                                <p>
                                    <strong>Brand:</strong> {product.brands || "N/A"}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {product.quantity || "N/A"}
                                </p>
                                <h4 className="mt-4 font-bold">Nutritional Information (per 100g):</h4>
                                <ul className="list-disc ml-6">
                                    {product.nutriments ? (
                                        <>
                                            <li>
                                                <strong>Calories:</strong> {product.nutriments["energy-kcal_100g"] || "N/A"} kcal
                                            </li>
                                            <li>
                                                <strong>Proteins:</strong> {product.nutriments.proteins_100g || "N/A"} g
                                            </li>
                                            <li>
                                                <strong>Fats:</strong> {product.nutriments.fat_100g || "N/A"} g
                                            </li>
                                            <li>
                                                <strong>Carbohydrates:</strong> {product.nutriments.carbohydrates_100g || "N/A"} g
                                            </li>
                                            <li>
                                                <strong>Sugars:</strong> {product.nutriments.sugars_100g || "N/A"} g
                                            </li>
                                            <li>
                                                <strong>Salt:</strong> {product.nutriments.salt_100g || "N/A"} g
                                            </li>
                                        </>
                                    ) : (
                                        <li>Nutritional information not available.</li>
                                    )}
                                </ul>
                                <button
                                    className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                                    onClick={() => addToDatabase(product)}
                                >
                                    Add to Database
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}