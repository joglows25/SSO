// config/passportConfig.js
require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const { default: axios } = require('axios');

passport.use(new FacebookStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://sso-55xt.onrender.com/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
},
async (accessToken, refreshToken, profile, done) => {
  const url=`graph.facebook.com/me?fields=id,name,accounts{fan_count,followers_count}&access_token=${accessToken}`;
  const responseAPI=axios.get(url).then(
    console.log(JSON.stringify(responseAPI))
  )
  console.log(`${profile._raw}`);
  const responseDB = await User.findOne({ 'fid': profile.id });
  console.log(`profile is ${profile._raw}`);
  try {
    if (responseDB) {
      console.log(`user found ${responseDB}`);
    } else {
      const newUser = new User();
      newUser.fid = profile.id;
      newUser.email = profile.emails[0].value;
      newUser.picture = profile.photos[0].value;
      newUser.name = profile.displayName;
      newUser.save();
      console.log(newUser);
    }
  } catch (error) {
    console.log(`no such user found`);
  }
  console.log(profile);
  return done(null, profile);
}
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => {
  return done(null, id);
});
