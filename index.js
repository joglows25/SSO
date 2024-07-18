// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const dbConnect = require('./config/config');
const {FCount}=require('./config/passportConfig')
require('./config/passportConfig');
const app = express();
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret', // replace 'your-secret-key' with your actual secret key
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored    
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/auth', authRoutes);

app.get('/',(req,res)=>{
    res.render("home.ejs")
})
app.get('/auth/facebook',passport.authenticate('facebook',{scope:['public_profile','email','pages_show_list','pages_read_engagement','pages_manage_posts']}))
app.get('/auth/facebook/callback',passport.authenticate('facebook',{
    successRedirect:'/profile',
    failureRedirect:'/failed'
}))
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())return next()
    res.redirect('/')
}
app.get('/profile',isLoggedIn,(req,res)=>{
    console.log(`the request is :: ${req.user}`);
     res.render('profile.ejs',{user:req.user})
})
app.get('/failed',(req,res)=>{
    res.send('you are NOT a valid User')
})
app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });

app.listen(5000);
dbConnect();