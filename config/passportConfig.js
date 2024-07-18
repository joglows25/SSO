// config/passportConfig.js
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(new FacebookStrategy({
  clientID: '455360777407780',
  clientSecret: 'e24ba1e90c8031e3cdc4d2a5a661851e',
  callbackURL: 'https://localhost:5000/facebook/callback',
  profileFields: ['id', 'displayName', 'email','picture.type(large)'],
},
async (accessToken, refreshToken, profile, done) => {
  console.log(`${profile._raw}`);
  
  const response=await User.findOne({'fid':profile.id});
  console.log(`profile is ${profile._raw}`);
  try {
    if(response){
      console.log(`user found ${response}`);
    }else{
      const newUser= new User();
      newUser.fid=profile.id;
      newUser.email=profile.emails[0].value;
      newUser.picture=profile.photos[0].value;
      newUser.name=profile.displayName;
      newUser.save();
      console.log(newUser);
      
    }
  } catch (error) {
    console.log(`no such user found`);
  }
  console.log(profile);
  return done(null,profile);
}
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => {
  return done(null,id);
});
