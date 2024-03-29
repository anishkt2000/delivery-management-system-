## Architecture

The Order Management System follows a client-server architecture, with the server implemented using Node.js and Express.js. MongoDB is used as the database to store order data. The system provides a RESTful API for interacting with order data, enabling clients to perform CRUD operations and track order status.

## Technologies Used

Node.js: A JavaScript runtime environment used for building server-side applications.

Express.js: A minimalist web framework for Node.js used to handle HTTP requests and define API routes.

MongoDB: A NoSQL database used to store order data in a flexible and scalable manner.

Mongoose: An ODM (Object Data Modeling) library for MongoDB used to define schemas, models, and interact with the database.

Multer: Middleware for handling file uploads used to upload CSV files containing order data.

CSV Parser: A library for parsing CSV files used to convert uploaded CSV files into JSON format.

Cors: Middleware for enabling Cross-Origin Resource Sharing (CORS) used to allow requests from different origins.

## Features

RESTful API: Provides API endpoints for performing CRUD operations on order data, including fetching order status, uploading order data from CSV files, and updating order status.

File Upload: Supports file uploads of CSV files containing order data, which are then parsed and stored in the database.

Error Handling: Implements error handling middleware to catch and handle errors that occur during request processing, providing appropriate error responses to clients.
Validation: Validates incoming request data to ensure data integrity and prevent malformed requests from reaching the database.
Unit Testing: Includes unit tests to ensure the correctness of API endpoints and business logic.
Documentation: Provides comprehensive documentation outlining installation instructions, API endpoints, database schema, and usage guidelines.

## API Endpoints
Get Card Status
Endpoint: GET /get_card_status
Parameters:
phone: Phone number (matches last 9 digits)
cardId: Card ID
Response: Returns the status of the card based on delivery attempts.

# File Upload
Endpoint: POST /add-file?type=
Parameters:
type: Specifies the type of file (pickup, delivery, delivered, returned)
File Format: The uploaded file should be a CSV file with the required columns.

## Usage
Installation: Clone the repository, install dependencies, and configure environment variables.
Start Server: Start the application using npm start.
Interact with API: Use tools like Postman or curl to make requests to the API endpoints.#   d e l i v e r y - m a n a g e m e n t - s y s t e m -  
 #   d e l i v e r y - m a n a g e m e n t - s y s t e m -  
 