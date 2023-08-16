
Description
Admins should be able to sign up
Admins should be able to create courses
Course has a title, description, price, and image link
Course should be able to be published or unpublished
Admins should be able to edit courses
Users should be able to sign up
Users should be able to purchase courses
Users should be able to view purchased courses
Users should be able to view all courses
There should be a room in which users who purchased the course should be able to chat with each other and the admin who posted the course
Routes
Admin Routes:
POST /admin/signup Description: Creates a new admin account. Input: { username: 'admin', password: 'pass' } Output: { message: 'Admin created successfully' }
POST /admin/login Description: Authenticates an admin. It requires the admin to send username and password in the headers. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { message: 'Logged in successfully' }
POST /admin/courses Description: Creates a new course. Input: Headers: { 'username': 'admin', 'password': 'pass' } Input: Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true } Output: { message: 'Course created successfully', courseId: 1 }
PUT /admin/courses/:courseId Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited. Input: Headers: { 'username': 'admin', 'password': 'pass' } Input: Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink: 'https://updatedlinktoimage.com', published: false } Output: { message: 'Course updated successfully' }
GET /admin/courses Description: Returns all the courses. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] } User Routes:
and many more please visit the routes in the backend
User routes
POST /users/signup Description: Creates a new user account. Input: { username: 'user', password: 'pass' } Output: { message: 'User created successfully' }
POST /users/login Description: Authenticates a user. It requires the user to send username and password in the headers. Input: Headers: { 'username': 'user', 'password': 'pass' } Output: { message: 'Logged in successfully' }
GET /users/courses Description: Lists all the courses. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
POST /users/courses/:courseId Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { message: 'Course purchased successfully' }
GET /users/purchasedCourses Description: Lists all the courses purchased by the user. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
and many more please visit the routes
