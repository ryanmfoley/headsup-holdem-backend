const mongoose = require('../db/connection')
const { model, Schema } = mongoose

// Create Schema //
const UserSchema = new Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
})

const User = model('User', UserSchema)

module.exports = User
