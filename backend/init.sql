CREATE DATABASE IF NOT EXISTS nutrient_checker;

USE nutrient_checker;

CREATE TABLE IF NOT EXISTS nutrients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    protein FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    fats FLOAT NOT NULL
);

