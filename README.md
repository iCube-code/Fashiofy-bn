# Fashiofy Backend Project

## Overview

This is a **Node.js** backend project built with **Express.js**, designed to serve as a RESTful API.  
It includes:  
✅ API health check endpoint  
✅ MongoDB database connection with a User schema  
✅ Several npm packages to streamline development and configuration

---

## Default Packages

- Express.js
- Mongoose
- Nodemon
- Dotenv
- More (install as you go)

---

## Prerequisites

- **Node.js**: Version 14.x or higher
- **MongoDB**: A running MongoDB instance (local or cloud-based, e.g., MongoDB Atlas)
- **Yarn**: Node package manager

---

## Installation

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

---

### 2️⃣ Install Dependencies

Using **npm**:

```bash
npm install
```

Or using **Yarn**:

```bash
yarn install
```

---

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the project root with:

```
PORT=8080
MONGODB_URI=<your-mongodb-connection-string>
```

---

### 4️⃣ Start the Server

For **development** (with Nodemon):

- Using npm:
  ```bash
  npm run dev
  ```
- Using Yarn:
  ```bash
  yarn dev
  ```

For **production**:

- Using npm:
  ```bash
  npm start
  ```
- Using Yarn:
  ```bash
  yarn start
  ```

---

## Project Structure

```
├── node_modules/                  # Installed npm/yarn dependencies
├── src/                           # Application source code
│   ├── config/                    # Configuration files (e.g., database connections, app settings)
│   ├── controller/                # Request handlers (e.g., userController.js) — handle incoming API requests
│   ├── models/                    # Mongoose models/schemas (e.g., User.js) — define database structure
│   ├── routes/                    # API route definitions (e.g., userRoutes.js) — map routes to controllers
│   ├── service/                   # Business logic/services (e.g., userService.js) — core logic separate from controllers
│   ├── utils/                     # Utility functions (e.g., loggers, email helpers, validators)
│   └── server.js                  # Entry point of the application — sets up Express server, connects middleware & routes
├── .env                           # Environment variables file (not tracked in git) — holds secrets like DB URI, API keys
├── package.json                   # Project metadata, scripts, and list of dependencies
├── yarn.lock                      # Exact dependency versions lock file (auto-generated)
└── README.md                      # Project overview, setup instructions, and documentation

```

---

## Available Scripts For Production

- `npm start` / `yarn start`: Runs the application with Node.js
- `npm run dev` / `yarn dev`: Runs the application with Nodemon for development

---

## API Endpoints

### Health Check

- **GET** `/healthcheck`  
  Returns:
  ```json
  { "status": "Everything is working as expected" }
  ```

---

## MongoDB Schema

### User Schema

The project includes a Mongoose User schema with the following fields:

| Field       | Type                     | Notes                                 |
| ----------- | ------------------------ | ------------------------------------- |
| firstName   | String                   | required, trimmed                     |
| lastName    | String                   | required, trimmed                     |
| email       | String                   | required, trimmed, lowercase          |
| phoneNumber | Number                   | required                              |
| password    | String                   | required                              |
| isActive    | String                   | optional                              |
| fk_role_id  | ObjectId (ref to `Role`) | foreign key to Role collection        |
| timestamps  | Date                     | createdAt and updatedAt automatically |

---

## Database Connection

The MongoDB connection is configured using **Mongoose** and the `DB_URI` environment variable.  
Ensure your MongoDB instance is running and the connection string is correctly set in the `.env` file.

---

## Development Tools

- **Nodemon**: Automatically restarts the server on file changes for efficient development
- **Environment Variables**: Use the `.env` file to manage sensitive info like database credentials

---

## Contributing

1. Fork the repository
2. Create a new branch
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch
   ```bash
   git push origin feature-branch
   ```
5. Create a pull request

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
