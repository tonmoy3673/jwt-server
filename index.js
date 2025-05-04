require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;
// ========= middleWare =========//

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));

app.get('/', (req, res) => {
    res.send('Server is Running')
  })

app.listen(port,()=>console.log(`Server is running on port ${port}`))