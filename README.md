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
      
      
