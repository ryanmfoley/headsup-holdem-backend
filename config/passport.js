const { ExtractJwt, Strategy } = require('passport-jwt')

// Load User model //
const User = require('../models/User')

const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.secretOrKey

module.exports = (passport) =>
	passport.use(
		new Strategy(opts, (payload, done) =>
			User.findById(payload.id)
				.then((user) => (user ? done(null, user) : done(null, false)))
				.catch((err) => console.log(err))
		)
	)
