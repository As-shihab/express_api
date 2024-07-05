const Connnection = require("../DB/conn");
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const middleware = require('./../middleware/checkauth')
const multer = require('multer')
const path = require('path');
const fs = require('fs')

router.get('/profile', middleware, (req, res) => {

    Connnection.query("SELECT * FROM `user` WHERE `email`=?  && `userid`=?",[req.email , req.userid] , (err, result) => {
        if (err) return res.json({ profile: false, massege: 'somthing went wrong' })

        if (result) {
            return res.json({ profile: result, massege: "User found" })
        }
    })
})

// update user
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "Upload")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })
router.post('/edit-ppicture', middleware, upload.single('ppicture'), (req, res) => {
    const email = req.email
    const userid = req.userid

    Connnection.query("SELECT * FROM `user` WHERE `userid` =? ", userid, (err, response) => {
        if (!response[0].profile_path) {

            Connnection.query("UPDATE `user` SET `profile_path`= ? , `isactive`=? WHERE `userid`=? ", [req.file.path , 1 , req.userid], (err, result) => {
                if (err) return res.json({ update: false, massege: 'somthing went wrong' })


                if (result) {

                    return res.json({ update: true, massege: 'Image updated' })
                } else {
                    return res.json({ update: false, massege: 'Somthing error' })
                }
            })

        }

        else {

            try {

                fs.unlink(response[0].profile_path, (err) => {
                    if (err) return res.json({ update: false, massege: "cant delete file" })



                    // deleteing files from server

                    Connnection.query("UPDATE `user` SET `profile_path`= ? , `isactive`=1 ", req.file.path, (err, result) => {
                        if (err) return res.json({ update: false, massege: 'somthing went wrong' })


                        if (result) {

                            return res.json({ update: true, massege: 'Image updated' })
                        } else {
                            return res.json({ update: false, massege: 'Somthing error' })
                        }
                    })

                    // end

                })

            }
            catch (err) {
                return res.json({ update: false, massege: 'somthing went wrong' })
            }



        }


    })



})


// listing

router.get("/user_listing", middleware, (req, res) => {
    Connnection.query("SELECT * FROM `listing` WHERE `email`=?  && `isactive` = ? ", [req.email, 1], (err, result) => {
        if (err) return res.json({ listing: 'not listing found', massege: 'somthing went err' })
        return res.json({ listing: result })
    })

})

router.get("/product_view/:id", (req, res) => {
    const { id } = req.params
    Connnection.query("SELECT * FROM `listing` WHERE `listingid`=?", id, (err, result) => {
        return res.json({ product_view: true, data: result[0] })
    })
})






module.exports = router


