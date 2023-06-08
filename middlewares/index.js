const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.checkJwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        console.error(err);
        next(err);
      }
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ result: false });
      }
    })(req, res, next);
  };