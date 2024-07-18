require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const axios = require('axios');

passport.use(new FacebookStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://sso-55xt.onrender.com/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const url = 'https://graph.facebook.com/v20.0/me';
    const params = {
      fields: 'id,name,accounts{fan_count,followers_count}',
      access_token: accessToken
    };
    const response = await axios.get(url, { params });
    const followersCount = response.data.accounts.data[0].followers_count;
    profile.followersCount = followersCount;
    console.log(`followers_count is: ${followersCount}`);
    
    const responseDB = await User.findOne({ 'fid': profile.id });
    if (!responseDB) {
      const newUser = new User({
        fid: profile.id,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        name: profile.displayName,
        followersCount: followersCount // Save followers_count to the user object
      });
      await newUser.save();
      console.log('New user created:', newUser);
    }

    return done(null, profile);
  } catch (error) {
    console.error('Error in Facebook authentication:', error);
    return done(error);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => {
  return done(null, id);
});

module.exports = passport;
