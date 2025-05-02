# 📚 eLib REST API Server

This is a RESTful API server for **eLib Book Library**, built with **Node.js** and **Express.js**. It supports uploading and managing book data, including cover images and eBook PDFs, which are stored in **Cloudinary**. The backend uses **MongoDB** for data storage.

---

## 🚀 Features

- 📖 CRUD operations for books
- 📤 Upload cover images and eBook PDFs via Multer
- ☁️ Cloudinary integration for file storage
- 🔐 JWT-based authentication
- ✅ Request validation with express-validator
- 📦 Modular structure with environment variable support

---

## 🧰 Technologies Used

- Node.js + Express.js
- MongoDB + Mongoose
- Multer for file uploads
- Cloudinary SDK
- JWT (jsonwebtoken) for authentication
- Express-validator
- Winston for logging
- Morgan for HTTP request logging

---

## 📁 Project Structure

```
restapi-server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── uploads/        # (temp local uploads before Cloudinary)
├── .env
├── app.js
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/jeevanshrestha/restapi-server.git
cd restapi-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 4. Run the server

```bash
npm start
```

Or with nodemon for development:

```bash
npx nodemon app.js
```

---

## 📬 API Endpoints Overview

| Method | Endpoint         | Description                    |
|--------|------------------|--------------------------------|
| POST   | /api/books       | Create a new book              |
| GET    | /api/books       | Get all books                  |
| GET    | /api/books/:id   | Get a book by ID               |
| PUT    | /api/books/:id   | Update book info               |
| DELETE | /api/books/:id   | Delete a book                  |

> All endpoints may require authentication and file validation.

---

## ☁️ Cloudinary Uploads

- **Cover Image**: Stored in a specific folder.
- **PDF File**: Uploaded and stored with metadata.
- Files are automatically uploaded from Multer's memory storage.

---

## 🛡️ Authentication

- JWT tokens are used for secure API access.
- Middleware ensures protected routes are only accessible to authenticated users.

---

## 🐞 Error Handling

- Uses `http-errors` to generate consistent error responses.
- Logs errors with `winston`.

---

## 🧪 Coming Soon

- User registration and roles
- Book search and filtering
- Rate-limiting and performance enhancements

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the repo and submit a PR.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Jeevan Shrestha**  
📬 [GitHub Profile](https://github.com/jeevanshrestha)