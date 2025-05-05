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
const ACCESS_TOKEN_EXPIRY=process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY=process.env.REFRESH_TOKEN_EXPIRY;



// ============= memory ============//
let users =[];
let refreshTokens=[];


// ========= generate token =========//
const generateAccessToken=(userId)=>{
  return jwt.sign({id:userId},JWT_SECRET,{expiresIn:ACCESS_TOKEN_EXPIRY})
}

const generateRefreshToken=(userId)=>{
  return jwt.sign({id:userId},REFRESH_SECRET,{expiresIn:REFRESH_TOKEN_EXPIRY})
}

const setTokens=(res,accessToken,refreshToken)=>{
  
  res.cookie('accessToken',accessToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV ==='production',
    sameSite:'strict',
    maxAge:3 * 60 * 1000
  });

  res.cookie('refreshToken',refreshToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite:'strick',
    maxAge:7 * 24 * 60 * 60 * 1000
  })

}


// ========= clear token ==========//
const clearTokens =(res)=>{
res.clearCookies('accessToken');
res.clearCookies('refreshToken');
}


// =========== register user ========//
app.post('/api/auth/register',async (req,res)=>{
  try{
    const {username,email,password} = req.body;
    const userExists = users.some(user=>user.email ===email)
    if (userExists) {
      return res.status(400).json({message:'User already exists'})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user ={
      id:Date.now().toString(),
      username,
      email,
      password:hashedPassword
    };

    users.push(user);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    refreshTokens.push(refreshToken)

    setTokens(res,accessToken,refreshToken);
    res.status(201).json({
      id : user.id,
      username:user.username,
      email: user.email
    });
  

  }


  catch (error){
   res.status(500).json({message : `Server Error`})
  }
});




// ============ functions ========//
app.get('/',async(req,res)=>{
  res.send('JWT Server is Running!!');
})


app.listen(PORT,()=>console.log(`Server is Running on port ${PORT}`))