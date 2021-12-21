const router = require('express').Router();
const { check, validationResult } =require('express-validator')
const { users } = require('../db')
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')
const procedures = require('../database/procedures')
const mysqlUtil = require('../utils/mysql')

router.post('/signup', [
    check("email", "올바른 이메일을 입력하시기 바랍니다.")
        .isEmail(),
    check("password","최소 6자 이상의 패스워드를 입력하시기 바랍니다.")
        .isLength({
            min:6,
        })

    ], async (req,res) => {
    const { password, email } = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array()
        })
    }

    let user = users.find((user) => {
        return user.email === email
    })
    if(user){
         return res.status(400).json({
              "errors" : [
                  {
                      "msg" : "이 이메일을 사용할 수 없습니다."
                  }
              ]
         })
    }

    let hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);

    users.push({
        email : email,
        password : hashedPassword
    });

    const token = JWT.sign({
        email : email
    }, 'secretKey',{
        expiresIn: 360000
    })
    res.json({
        token
    })

})


router.post('/login', async (req,res)=> {
    // 1. 요청 이메일과 패스워드를 얻는다
    // 2. DB에 접속하여 해당 이메일의 정보를 확인한다.
    // 3. 유저정보(이메일)가 없으면 로그인실패 리턴한다.
    // 4. 유저정보가 있으면 비밀번호를 확인한다.
    // 5. 비밀번호가 일치하면 토큰을 발급한다. || 비밀번호가 불일치라면 로그인실패 리턴한다.

    console.log("로그인 테스트")
    const {password, email} = req.body;

    let loginProcedure = procedures.authHandler('login', email, password);

    let loginResult = await mysqlUtil.mysql_exec(loginProcedure);

    console.log('loginResult : ', loginResult);

    return res.json({
        'test': 'end'
    })
    let user = users.find((user)=>{
        return user.email === email
    })


    if(!user){
        return res.status(400).json({
            "errors":[
                {
                    "msg" : "Invalid Credentials"
                }
            ]
        })
    }


    let isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        return res.status(400).json({
            "errors":[
                {
                    "msg" : "Invalid Credentials"
                }
            ]
        })
    }

    const token = JWT.sign({
        email : email
    }, 'secretKey',{
        expiresIn: 360000
    })
    res.json({
        token
    })
})


router.get('/all', (req,res) => {
    res.json(users)
})

module.exports = router