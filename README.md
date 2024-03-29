- Author By: Khitsada Phetsaior [KP]
- Author Date: 2024-01-07
- Author Description: Node.js-JWT-Express-Mongodb-Authentication.

## Node.js - JWT - Express Authentication, Login and Registration with mongodb

- node-jwt-express-mongodb-authentication [Flow]
[Authenication System_KP.pdf](https://github.com/khphet/nodejs-jwt-express-mongodb--authentication/files/13852370/Authenication.System_KP.pdf)

- [Flow][1]
![Authenication System_KP 1](https://github.com/khphet/nodejs-jwt-express-mongodb--authentication/assets/149032271/729113b1-75f1-4fa4-a7a0-b4bd29f47938)

- [Flow][2]
![Authenication System_KP 2](https://github.com/khphet/nodejs-jwt-express-mongodb--authentication/assets/149032271/3497c07d-9933-4b14-8d6d-6c0211b9b1b1)

## Setup Environments

- 1. Download & Setup Node.js (Windows x64)
#### https://nodejs.org/en/download
- 2. Download & Setup MongoDB (Windows x64)
#### https://www.mongodb.com/try/download/community   
- 3. Download & Setup Postman (Windows x64)
#### https://www.postman.com/downloads/
- 4. Clone to your environment
```
git clone https://github.com/khphet/nodejs-jwt-express-mongodb--authentication.git   
```

## Project Structures
### npm package
    "bcryptjs": "2.4.3",
    "cookie-session": "2.0.0",
    "cors": "2.8.5",
    "email-validator": "2.0.4",
    "express": "4.18.2",
    "is-valid-username": "0.0.1",
    "jsonwebtoken": "9.0.2",
    "mailchecker": "6.0.1",
    "mongoose": "6.12.5",
    "password-validator": "5.3.0",
    "username-checker": "0.1.0",
    "validator": "13.11.0"

### Directories
![Directory](https://github.com/khphet/nodejs-jwt-express-mongodb--authentication/assets/149032271/1d890eb7-1d0d-4f39-a90e-cc87b64a23af)

#### config
  - Configure Auth Key
  - Configure MongoDB
  - Confgure Token

#### controller
  - auth.controller => handle signup, signin & signout actions
  - user.controller => return public & protected content

#### middlewares
  - authJwt => Check user roles and verify token
  - verifySignUp => Check Username format, Check password validate, Check email validate, Check duplicate username & password

#### models 
  - user.model => mongoose
  - role.model => mongoose

#### routes
  - auth.routes => POST authen user signup, signin and signout
  - user.routes => GET check and test resource


  




