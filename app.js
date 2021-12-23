const express = require('express');
const port=5000;
const authRouter = require('./route/auth')
const post = require("./route/post")
let enableCORS = require('./middleware/cors');
require('dotenv').config()

const app = express();


/*미들웨어 cors */
// app.use(cors())
app.use(enableCORS)
app.use(express.json());


/*라우터*/
app.use('/auth',authRouter)
app.use('/posts',post)

app.listen(port, ()=>{
    console.log(`start JWT Authentication port is ${port}`)
})
