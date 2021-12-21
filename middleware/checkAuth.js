const JWT = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');

    //토큰이 없을 떄 리턴
    if(!token){
        return res.status(400).json({
            "errors" : {
                "msg" : "No token found"
            }
        })
    }

    // 토큰 증명 실패시 리턴 | 증명 성공시 next()
    try{
        let user = await JWT.verify(token, "secretKey")
        req.user = user.email
        next()
    } catch (error) {
        return res.status(400).json({
            "errors" : {
                "msg" : "token Invalid"
            }
        })
    }
}