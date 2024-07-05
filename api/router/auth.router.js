const Connnection = require("../DB/conn");
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const middleware = require('./../middleware/checkauth');

router.post('/signup', (req, res) => {

if(req.body.email=="" || req.body.password=="" || req.body.nickname==""){
    return res.json({massege:"fill the inputs"})
}


    const CHECKCOUNT = "SELECT COUNT(*) AS count FROM `user`  WHERE `email`=?  "
    Connnection.query(CHECKCOUNT, [req.body.email], (err, result) => {
        if (result[0].count >= 1) {
            return res.json({ massege: "user already exist", route: "login" , signup:false})
        }
        else {
            const SQL = "INSERT INTO `user`(`nickname` , `email` , `password`) VALUES(? ,? , ? ) ";
            Connnection.query(SQL, [req.body.nickname, req.body.email, req.body.password], (err, result) => {
                if (err) return res.json(err)

                return res.json({

                    signup: true,
                    route: "login",
                    massege: "user created successfully"
                })

            })
        }
    })



})

router.post('/login', (req, res) => {
    if(req.body.email=="" || req.body.password==""){
        return res.json({massege:"fill the inputs"})
    }
    const sql = "SELECT * FROM `user` WHERE `email`=? && `password`=?";
    Connnection.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (!result[0] == "") {
            const token = jwt.sign({
                email: result[0].email,
                userid: result[0].userid,
                nickname: result[0].nickname,
                profile_path: result[0].profile_path
            } , JSON.stringify(process.env.AUTH_SECRET) , {expiresIn:60*60*60})
            
            
            return res.json({
                email:result[0].email,
                userid: result[0].userid,
                token: token
                ,login:true
      })
        }
        else {
            return res.json({ massege: "user doesn't exist", route: "signup", auth: false , test:req.body})
        }
    })
})


router.get('/isauth' , (req, res)=>{
    const token = req.headers['access_token'];
  const data_token=  jwt.verify(token , JSON.stringify(process.env.AUTH_SECRET), (err ,decoded)=>{
        if(decoded){
            return res.json({auth: true})
        }
        return res.json({auth:false})
    })

})




module.exports = router