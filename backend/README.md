# Blog-App Backend

This is the backend for the Blog-App, a RESTful API built with Node.js, Express, and MongoDB. It supports blog management, image uploads (via ImageKit), authentication, and comment moderation.

## Features
- User authentication (admin)
- Blog CRUD operations
- Image upload and optimization (ImageKit)
- Commenting system with moderation
- Environment-based configuration

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- ImageKit (for image storage)
- Multer (for file uploads)
- JWT (for authentication)
- dotenv (for environment variables)

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)
- ImageKit account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Tirth-955/Blog-API.git
   cd Blog-API/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=your_admin_email
   ADMIN_PASSWORD=your_admin_password
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

### Running the Server
```bash
npm run dev
```
The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Auth (Admin)
- `POST /api/admin/login` — Login as admin

### Blogs
- `POST /api/blog/add` — Add a new blog (multipart/form-data: `image` (file), `blog` (JSON string))
- `GET /api/blog/all` — Get all published blogs
- `GET /api/blog/:blogId` — Get a blog by ID
- `POST /api/blog/delete` — Delete a blog (admin only)
- `POST /api/blog/toggle-publish` — Toggle publish status (admin only)

### Comments
- `POST /api/blog/comment` — Add a comment
- `POST /api/blog/comments` — Get comments for a blog
- `GET /api/admin/comments` — Get all comments (admin only)
- `POST /api/admin/delete-comment` — Delete a comment (admin only)
- `POST /api/admin/approve-comment` — Approve a comment (admin only)

### Dashboard (Admin)
- `GET /api/admin/dashboard` — Get dashboard stats

## Usage Notes
- All admin routes require a valid JWT token in the `Authorization` header.
- For blog creation, use `multipart/form-data` with an `image` file and a `blog` field containing a JSON string.
- Images are uploaded and optimized via ImageKit.
