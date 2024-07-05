const express = require('express');
require('dotenv').config()
require('./api/DB/conn')
const cors = require('cors')
const Auth_router = require('./api/router/auth.router')
const User_router = require('./api/router/user.router')
const host_router = require('./api/router/host.router')
const App = express();
App.use(express.json())
App.use(cors())
App.use('/Upload' , express.static('./Upload'))

App.use('/api/auth' ,Auth_router)
App.use('/api/user', User_router )
App.use('/api/host' , host_router)
App.listen(process.env.PORT , ()=>{
    console.log('server runing')
})