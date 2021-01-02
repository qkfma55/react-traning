const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxLength: 50
	},
	email: {
		type: String,
		trim: true, // 빈칸제거기능
		unique: 1 // 같은 이메일은 사용하지 못하게
	},
	password: {
		type: String,
		minlength: 5
	},
	lastname: {
		type: String,
		maxLength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: { // 유효성 관리
		type: String
	},
	tokenExp: { // 토큰의 유효기간
		type: Number
	}
})

const User = mongoose.model('User', userSchema)

module.exports = { User };
