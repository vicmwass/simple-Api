const express=require("express")
const morganMiddleware =require('./morganMiddleware.js')
const urlencoded=express.urlencoded
const jwt = require('jsonwebtoken')

const app = express();

app.use(morganMiddleware)
app.use(urlencoded({extended:true}))

const accountRoutes =require("./routes/accounts.js")

app.use("/accounts",accountRoutes)

app.post('/login', (req, res) => {
  const { username,password } = req.body;
  const user = { username };
  const accessToken =generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//   refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })

})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
  })

function authenticateToken(req, res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json(user);
  });
}

app.post('/refresh-token',(req,res)=>{
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) return res.sendStatus(401);
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
      res.json({ accessToken });
    });
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
  }





module.exports= app
