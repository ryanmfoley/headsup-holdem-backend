const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// Load User model //
const User = require('../models/User')

// @route   POST api/users/register //
// @desc    Register user //
// @access  Public //
router.post('/register', (req, res) => {
	const { username, password } = req.body

	User.findOne({ username }).then((user) => {
		if (user) {
			return res.status(400).json({ username: 'Username already exists' })
		}

		// Hash Password //
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) throw err

				req.body.password = hash

				User.create(req.body)
					.then((user) => res.json(user))
					.catch((err) => console.log(err))
			})
		})
	})
})

// @route   POST api/users/login //
// @desc    Login user / Returning JWT Token //
// @access  Public //
router.post('/login', (req, res) => {
	const { username, password } = req.body

	// Find user by name //
	User.findOne({ username }).then((user) => {
		// Check for user //
		if (!user) {
			return res.status(404).json({ userNotFound: true })
		}

		// Check Password //
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				// Password correct //
				const payload = { id: user.id, name: user.username }

				// Sign Token //
				return jwt.sign(
					payload,
					process.env.secretOrKey,
					{ expiresIn: 3600 },
					(err, token) => res.json({ success: true, token: 'Bearer ' + token })
				)
			}

			// Password incorrect //
			return res.status(400).json({ invalidPassword: true })
		})
	})
})

router.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			// id: req.user.id,
			username: req.user.username,
		})
	}
)

module.exports = router
