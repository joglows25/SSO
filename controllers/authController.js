const passport = require('passport');

exports.facebookAuth = passport.authenticate('facebook');

exports.facebookCallback = passport.authenticate('facebook', {
  successRedirect: '/api/v1/auth/profile',
  failureRedirect: '/api/v1/auth/login',
  failureFlash: true,
});

exports.profile = (req, res) => {
  if (!req.isAuthenticated() || !req.user.isProfessional) {
    return res.redirect('/api/v1/auth/login');
  }
  res.json(req.user);
};

exports.login = (req, res) => {
  res.send('Please log in.');
};
