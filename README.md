# Assembly Parts Inventory System

A backend system for managing assembly parts inventory, supporting both raw parts and assembled parts with nested assembly capabilities.

## Features

- Create and manage raw parts
- Create assembled parts with nested assembly support
- Track inventory quantities
- Support for deep nesting of assemblies
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (for database)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/iampatelsandip/assembly-parts-backend.git
cd assembly-parts-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/assembly-parts
```

4. Start the server:
```bash
npm run dev
```

The server will start running on `http://localhost:3000`

## API Documentation

### Swagger Documentation
You can access the interactive API documentation at: `http://localhost:3000/api-docs`

### API Collection

The project includes a Postman collection for testing the API endpoints. You can find it in the root directory as `Assembly Parts Inventory System.postman_collection.json`

### Available Endpoints

#### 1. Create Raw Parts
- **POST** `/api/part`
- **Body:**
```json
{
  "name": "Bearing",
  "type": "RAW"
}
```

#### 2. Add Raw Part Quantities
- **POST** `/api/part/:partId`
- **Body:**
```json
{
  "quantity": 30
}
```

#### 3. Create Assembled Part (Simple Assembly)
- **POST** `/api/part`
- **Body:**
```json
{
  "name": "Gear",
  "type": "ASSEMBLED",
  "parts": [
    { "id": "bolt-5j8z", "quantity": 4 },
    { "id": "shaft-5gf1", "quantity": 2 }
  ]
}
```

#### 4. Create Assembled Part (Nested Assembly)
- **POST** `/api/part`
- **Body:**
```json
{
  "name": "Gearbox",
  "type": "ASSEMBLED",
  "parts": [
    { "id": "gear-yxn3", "quantity": 2 },
    { "id": "shaft-5gf1", "quantity": 2 }
  ]
}
```

#### 5. Add Assembled Part to Inventory
- **POST** `/api/part/:partId`
- **Body:**
```json
{
  "quantity": 1
}
```

## Testing the API

1. Import the Postman collection:
   - Open Postman
   - Click "Import" and select the `Assembly Parts Inventory System.postman_collection.json` file

2. The collection includes example requests for:
   - Creating raw parts
   - Adding quantities to parts
   - Creating simple assemblies
   - Creating nested assemblies
   - Deep nesting tests

## Project Structure

```
assembly-parts-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
├── .env
├── package.json
└── README.md
```

## Error Handling

The API includes proper error handling for:
- Invalid part types
- Missing required fields
- Invalid quantities
- Non-existent parts
- Circular dependencies in assemblies
