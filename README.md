# Forums Website Backend

## Project Overview

This project is a backend API for a forums website similar to Reddit.  
It allows users to register, log in, create posts, comment on posts, and like posts.  
The system also includes protected routes and admin functionality.  
The backend is built using Node.js, Express, TypeScript, and MongoDB.

## Team Members

- Aayushma Nagarkoti
- Manav Patel
- Mohit Sharma

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB / Mongoose
- JWT Authentication
- Jest
- Supertest
- Bruno

## Main Features

- User registration and login
- JWT-based authentication
- Create, update, delete posts
- Add comments to posts
- Like and unlike posts
- Protected routes
- Admin routes
- MongoDB database integration
- API testing support

## Project Structure

```text
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  tests/
  utils/
  app.ts
  server.ts
```
## Setup Instructions

### Prerequisites
- Node.js
- MongoDB installed locally

### Installation

1. Clone the repository
   git clone https://github.com/KusumKumari28/prog3271-final-project-group15.git

2. Install dependencies
   npm install

3. Create a .env file in the root folder
   Copy .env.example and fill in your values:
   
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/forum_db
   JWT_SECRET=your_secret_key_here

4. Start the server
   npm run dev

5. Run tests
   npm test