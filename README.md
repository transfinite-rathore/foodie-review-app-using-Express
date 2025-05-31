# Foodie Review App using Express

A RESTful API backend for a food review application built with Node.js, Express, and MongoDB.  
This project allows users to browse food items from restaurants, add reviews, rate dishes, and manage food categories.

---

## Features

- Fetch food items by restaurant, category, rating, or review positivity
- Add, update, and delete food items (secured routes with owner verification)
- Manage food item categories (add/delete categories)
- Aggregated rating calculations and sorting by weighted scores
- Supports paginated and filtered queries for flexible data retrieval

---

## Technologies Used

- Node.js & Express.js
- MongoDB & Mongoose
- JWT-based authentication for secure routes
- REST API design principles

---

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- MongoDB database
- Git

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/transfinite-rathore/foodie-review-app-using-Express.git
   cd foodie-review-app-using-Express
2. Run the server
   ``` bash
   npm build
### API Endpoints
- GET /api/restaurant/:restaurantId/foodItems - Get food items by restaurant (supports filters)

- GET /api/restaurant/:restaurantId/foodItems/:foodItemId - Get single food item by ID

- POST /api/restaurant/:restaurantId/foodItems/add - Add new food item (secured)

- PUT /api/restaurant/:restaurantId/foodItems/:foodItemId - Update food item (secured)

- DELETE /api/restaurant/:restaurantId/foodItems/:foodItemId - Delete food item (secured)

- POST /api/restaurant/:restaurantId/foodItems/:foodItemId/categories - Add categories to food item

- DELETE /api/restaurant/:restaurantId/foodItems/:foodItemId/categories - Delete categories from food item
