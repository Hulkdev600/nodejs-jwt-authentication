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

    const { password, email, name } = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array()
        })
    }

    let hashedPassword = await bcrypt.hash(password, 10) //패스워드 해시암호화

    let signupProcedure = procedures.authHandler('signup', email, hashedPassword, name); //프로시져 스트링 리턴

    let mysqlResult = await mysqlUtil.mysql_exec(signupProcedure); // 프로시져 실행

    let signupResult = mysqlResult[0][0]; // 로그인 프로시져 결과 리턴


    if(signupResult.code === '-1'){
         return res.status(400).json(signupResult)
    }

    // let hashedPassword = await bcrypt.hash(password, 10)
    // console.log(hashedPassword);

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


    let loginProcedure = procedures.authHandler('login', email); //프로시져 스트링 리턴

    let mysqlResult = await mysqlUtil.mysql_exec(loginProcedure); // 프로시져 실행

    let loginResult = mysqlResult[0][0]; // 로그인 프로시져 결과 리턴

    let resultCode = loginResult.code;
    let resultMsg = loginResult.msg;
    let resultEmail = loginResult.email;
    let resultPassword = loginResult.password;


    if(loginResult.code === '-1'){
        return res.status(400).json({
            code : resultCode,
            msg : resultMsg
        })
    }

    let passwordCompare = await bcrypt.compare(password, resultPassword)

    if(!passwordCompare){
        let resultMsg = '비밀번호가 일치하지 않습니다;'
        return res.status({
            code : resultCode,
            msg : resultMsg,
            email : resultEmail
        })
    }

    const token = JWT.sign({ email : email }, 'secretKey',{
        expiresIn: 360000
    })

    res.json({
        code : '200',
        msg : '로그인 성공',
        token : token
    })
})


router.get('/all', (req,res) => {
    res.json(users)
})

module.exports = router


/*
//프로시져에서 값을 추출해서 여기서 비밀번호를 비교할수도 있다. 방법은 여러가지
//프로시져에서 비밀번호체크까지 한번에 하는 방법이 있고 , 디비에서 이메일만 확인하여 가져와서 서버에서 비밀번호를 확인할수있다. => 여러가지 방법이 있다는 것을 경험하라는 의미로 적음
router.post('/login', async (req,res)=> {
    // 1. 요청 이메일과 패스워드를 얻는다
    // 2. DB에 접속하여 해당 이메일의 정보를 확인한다.
    // 3. 유저정보(이메일)가 없으면 로그인실패 리턴한다.
    // 4. 유저정보가 있으면 비밀번호를 확인한다.
    // 5. 비밀번호가 일치하면 토큰을 발급한다. || 비밀번호가 불일치라면 로그인실패 리턴한다.

    console.log("로그인 테스트")
    const {password, email} = req.body;

    let loginProcedure = procedures.authHandler('login', email, password);

    let mysqlResult = await mysqlUtil.mysql_exec(loginProcedure);

    console.log('loginResult : ', mysqlResult);

    let loginResult = mysqlResult[0][0];


    if(loginResult.code !== '0'){
        return res.status(400).json({
            result : loginResult
        })
    }


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
*/
