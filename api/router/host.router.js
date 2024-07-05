const Connnection = require("../DB/conn");
const express = require('express')
const router = express.Router()
const jwt  = require('jsonwebtoken')
const middleware= require('./../middleware/checkauth')
const data_token = require('./auth.router');
const multer = require("multer");
const path = require("path")
const fs = require('fs')
const slower = require('../middleware/slower')

router.post('/newlisting' , middleware , (req , res)=>{
    const sql = "INSERT INTO `listing`(`email` , `userid` , `nickname` , `profile_path`) VALUES( ? , ? , ? ,? )"
    
    setTimeout(() => {
        Connnection.query(sql , [req.email , req.userid , req.nickname , req.profile_path], (err , result)=>{
        
            if(result){
                Connnection.query("SELECT * FROM `listing` ORDER BY listingid DESC LIMIT 1" , (err , viewdata)=>{
               
                    if(viewdata){
                        return res.json({
                            newlisting: true,
                            productid: viewdata[0].listingid
                        })


                       
                    }
       
                    return res.json({
                        newlisting: false
                    })
                })
            }
        })
    }, 100);

})




router.get('/locallts' , (req ,res)=>{
   Connnection.query("SELECT * FROM `listing`  WHERE `isactive`=1  ORDER BY listingid DESC LIMIT 5" , (req, result)=>{
    return res.json({
        ltsdata: result
    })
   })
})


// getting draft list
 
router.get("/draft" ,middleware , (req, res)=>{
    Connnection.query("SELECT * FROM `listing` WHERE `isactive`= 0  ORDER BY listingid DESC" , (err, result )=>{
    if(err) return res.json({draft: false , massege: 'somthing went error'})

        return res.json(result)
    })
})

// end draft list

// complite listing 
router.get("/complete" , middleware , (err, res)=>{
    Connnection.query("SELECT * FROM `listing` WHERE `isactive` = 1 ORDER BY listingid DESC " , (err, result)=>{
        if(err) return res.json({complete: false , massege:'somthign went error'})

            return res.json(result)
    })
})

const storage = multer.diskStorage({
    destination:function(req , file , cb){
        cb(null , "Upload")
    },
    filename:function(req ,file , cb){
        cb(null , Date.now()+path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})

router.post("/listing_img" , middleware ,slower, upload.array("listing_img"), (req , res)=>{

    Connnection.query("SELECT * FROM `listing` ORDER BY listingid DESC LIMIT 1" , (err, result)=>{
       if(result){
       
        const listingid= result[0].listingid;
        const data= JSON.stringify(req.files)
        
        Connnection.query("UPDATE `listing` SET `photos`=? WHERE `listingid`=?" , [data , listingid])
       
        return res.json({update: true})
       }
       })

// updating user listing profile picture

})

// delete listing base on id

router.delete("/delete_listing/:id" , middleware , (req , res) =>{
    const {id} =req.params

    Connnection.query("DELETE FROM `listing` WHERE `listingid`= ?" , id , (err, result)=>{
        
        if(result){
          return  res.json({delete:true})
        }
    })

 
})






module.exports = router