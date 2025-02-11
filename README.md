# eManager  

## Overview  
**eManager** is a backend application built with **Express.js** and **MongoDB**, designed to handle user authentication, management, and resource handling efficiently. The project follows best practices for API development, including a modular architecture with controllers, middleware, and structured database models.  

## Features  
- User authentication (JWT-based)  
- Role-based access control (RBAC)  
- CRUD operations for users and resources  
- Middleware for logging, error handling, and validation  
- Secure password hashing with bcrypt  

## Tech Stack  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose ORM  
- **Authentication:** JSON Web Tokens (JWT), bcrypt  
- **Middleware:** Express Validator, Morgan (for logging)  

## Project Structure  
```
eManager/
│── src/
│   ├── config/         # Configuration files (DB, environment variables)
│   ├── controllers/    # Business logic for API endpoints
│   ├── middlewares/    # Authentication, validation, error handling
│   ├── models/         # Mongoose schemas and database models
│   ├── routes/         # API route definitions
│   ├── utils/          # Helper functions
│   ├── app.js          # Express app setup
│── .env.example        # Environment variables template
│── package.json        # Dependencies and scripts
│── README.md           # Project documentation
```  

## Getting Started  

### Prerequisites  
Ensure you have the following installed:  
- **Node.js** (v16 or later)  
- **MongoDB** (local or cloud instance)  

### Installation  
1. Clone the repository:  
   ```sh
   git clone https://github.com/abjerry97/emanager.git
   cd emanager
   ```  
2. Install dependencies:  
   ```sh
   npm install
   ```  
3. Set up environment variables:  
   - Copy `.env.example` to `.env` and update the values accordingly.  

4. Start the server:  
   ```sh
   npm start
   ```  
   The server will run on `http://localhost:5000` by default.  

## API Endpoints  

| Method | Endpoint         | Description                     | Auth Required |
|--------|-----------------|---------------------------------|--------------|
| POST   | `/api/auth/register` | Register a new user       | ❌ |
| POST   | `/api/auth/login`    | Authenticate user & get token | ❌ |
| GET    | `/api/users`         | Get all users (Admin only) | ✅ |
| GET    | `/api/users/:id`     | Get user by ID             | ✅ |
| PATCH  | `/api/users/:id`     | Update user details        | ✅ |
| DELETE | `/api/users/:id`     | Delete user (Admin only)   | ✅ |

## Contributing  
Contributions are welcome! Please open an issue or submit a pull request with improvements.  

## License  
This project is licensed under the **MIT License**.  
```
