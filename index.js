require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

// ======== middleWare ========//
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}))

// ============ Configuration =========//
const PORT = process.env.PORT || 5000;
const JWT_SECRET=process.env.JWT_SECRET;
const REFRESH_SECRET=process.env.REFRESH_SECRET;

// ============= memory ============//
let users =[];
let refreshTokens=[];



// ============ functions ========//
app.get('/',async(req,res)=>{
  res.send('JWT Server is Running!!');
})


app.listen(PORT,()=>console.log(`Server is Running on port ${PORT}`))