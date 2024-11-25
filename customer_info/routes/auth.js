const {readToken,updateToken,deleteToken,readCustomerByUsername}=require("../database.js")
require('dotenv').config()
const jwt = require('jsonwebtoken')
const  { Router } =require("express")
const {defLogger } =require('../logger.js' )
// const bodyParser= require("body-parser")
const router=Router()

const logger=defLogger
// create application/json parser
// var jsonParser = bodyParser.json()

router.post("/login", (req, res) => {
    const { username,password } = req.body;
    if (username==undefined || password==undefined) {
        logger.error("username or password not provided")
        res.status(400).json({
            message:"username or password not provided"
        })
        
    }else{
    readCustomerByUsername(username).then((result)=>{
        if (result==undefined) {
            logger.error("customer does not exist");
            res.status(400).json({
                message:"customer does not exist"
            })
        }else{
            if (result.password!=password) {
                console.log(result.p)
                logger.error("password is incorrect");
                res.status(400).json({
                    message:"password is incorrect"
                })
            }else{
                const user = { username,id:result.id };
                const accessToken =generateAccessToken(user);
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                updateToken(username, refreshToken).then((row)=>{
                    logger.info(`token for user ${username} was updated`)
                }).catch((err)=>{
                    logger.error(err.message)
                })
                res.json({ accessToken: accessToken, refreshToken: refreshToken })
            }
        }
    }).catch((err)=>{
        logger.error(err.message);
        res.status(500).json({
            message:"database failure"
        })
    })  }
  })
  
router.post("/refresh-token",(req,res)=>{
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) return res.sendStatus(401);
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken =generateAccessToken({ username: user.username,id:user.id });
      res.json({ accessToken });
    });
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '70s' })
  }
function authenticateToken(req, res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
        req.user = user
        next()
    });
  }
  const authRoutes=router
  module.exports={authenticateToken,authRoutes}