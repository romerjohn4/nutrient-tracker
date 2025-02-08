"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Page() {
    const [foodData, setFoodData] = useState(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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
    

        const handleItemSelect = (item) => {
        // Clean up the item name
        let cleanedName = item.name
            .replace(/[\d]/g, '') // Remove numbers
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C[\uDC00-\uDFFF]|[\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|[\uD83E[\uDD10-\uDDFF])/g, '') // Remove emojis
            .trim(); // Remove leading/trailing spaces

        // Check if the name contains a comma
        const commaIndex = cleanedName.indexOf(',');
        if (commaIndex !== -1) {
            // If there is a comma, keep everything before the comma
            cleanedName = cleanedName.slice(0, commaIndex).trim();
        }

        setSelectedItemName(cleanedName);
    };

return (
    <div className="mt-4">
        <div className="flex items-center justify-center">
            <h1 className="ml-4 text-4xl font-bold mb-2 underline text-purple-300">Nutrient Checker Application</h1>
        </div>
        <div className="flex items-center justify-center ">
            <p className="ml-4 text-4xl font-bold text-purple-300 mb-12">Check the nutrients of your meals and snacks and see how what kind of nutrients there is!</p>
        </div>
        <div>
            <SearchBar setSelectedItemName={handleItemSelect} onSearch={getFoodData} />
        </div>
        {error && <p className="text-red-500 ml-4">{error}</p>}
        {foodData && foodData.length > 0 && (
            <div className="ml-4 mt-6">
                <h2 className="text-2xl font-lg text-purple-300">Results Or Similar For {searchQuery}:</h2>
                <p className=" font-bold"> Scroll down for more options!</p>
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
                </div>
            ))}
        </div>
    </div>
    )}
</div>
)};