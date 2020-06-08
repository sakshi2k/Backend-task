### Backend-task

A NodeJS application for user and admin registration with REST APIs implementation.

#### Salient features
1. Models that includes Authentication via:

  Email id  (Admin authentication)

    - Authentication status update for Users by Admin

  Admin approval  (User authentication)

    - Admin authentication confirmation through email

2. CRUD operations on users 
3. Update Details of users 
    - individually by ID
    - all users
  
#### Routes 
 
#####   ADMIN ROUTES

 /admin : 
 
      get - Renders registration page
      
      post - Creates an ADMIN User
      
 /admin/verify :
 
      get - To Verify Admin account via Secret Code
      
      post - Authenticated Registeration
      
 /admin/authenticateUsers :
 
      get - To authenticate new users
      
      post - To authenticate new users 
      
#####  USER ROUTES

 /user :
 
      get - Renders registration page
      
      post - Creates a user
      
 /user/:userEmail :
 
      get - To get details of a single User
      
      patch - Edits the details of a single user
      
      delete - Deletes a single user entry from the User table
      
 /users/findAll : 
 
      get - Lists all the users present in the User table
  

###### dependencies {
    "body-parser": "^1.19.0",
    "ejs": "^3.1.3",
    "express": "^4.17.1",
    "mongoose": "^5.9.18",
    "multer": "^1.4.2",
    "nodemailer": "^6.4.8",
    "randomstring": "^1.1.5"
###### }
