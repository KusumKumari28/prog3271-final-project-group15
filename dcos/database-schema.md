# Forum Website Database Schema

## 1. User Collection
This collection stores all registered users.

Fields:
- _id
- name
- email
- password
- role
- createdAt

Example:
{
  "_id": "ObjectId",
  "name": "Aayushma",
  "email": "aayushma@example.com",
  "password": "hashed_password",
  "role": "user",
  "createdAt": "date"
}

---

## 2. Post Collection
This collection stores posts created by users.

Fields:
- _id
- title
- content
- authorId
- createdAt
- updatedAt

Example:
{
  "_id": "ObjectId",
  "title": "Best backend framework",
  "content": "Which backend framework should I learn?",
  "authorId": "ObjectId",
  "createdAt": "date",
  "updatedAt": "date"
}

---

## 3. Comment Collection
This collection stores comments made on posts.

Fields:
- _id
- content
- postId
- authorId
- createdAt
- updatedAt

Example:
{
  "_id": "ObjectId",
  "content": "You should try Express.js",
  "postId": "ObjectId",
  "authorId": "ObjectId",
  "createdAt": "date",
  "updatedAt": "date"
}

---

## 4. Like Collection
This collection stores likes on posts.

Fields:
- _id
- userId
- postId
- createdAt

Example:
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "postId": "ObjectId",
  "createdAt": "date"
}

---

## Relationships

- One user can create many posts
- One user can create many comments
- One post can have many comments
- One post can have many likes
- One user can like many posts
- One like belongs to one user and one post

---

## Summary

User -> Post = one to many  
User -> Comment = one to many  
User -> Like = one to many  
Post -> Comment = one to many  
Post -> Like = one to many