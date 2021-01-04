const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt를 이용해서 비밀번호를 암호화 해야한다. salt생성 후 saltRounds : 10자리인 솔트를 만들어서 비밀번호를 암호화한다.
const jwt = require('jsonwebtoken')

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

userSchema.pre('save', function(next){
	var user = this;
	if(user.isModified('password')) { // password가 변경될때만 실행
		// 비밀번호를 암호화 시킨다.
		bcrypt.genSalt(saltRounds, function(err, salt) {
			// err가 나면 index.js의 save영역으로 보내고
			if(err) return next(err)
			// 제대로 가져오면 index.js에 만들어놓은 user 인스턴스를 가져와서 변수에 this로 담아준다.
			// 비밀번호를 암호화 시킨다
			bcrypt.hash(user.password, salt, function(err, hash) { // hash는 암호화 된 비밀번호이다.
				if(err) return next(err)
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
}) // 몽구스에서 가져온 메소드인데 save 하게 되면 userSchema의 정보를 저장하기 전에 func를 실행 한다
// func 실행이 완료되면 next()로 index.js의 save 영역으로 포커스를 보내버린다.

userSchema.methods.comparePassword = function(plainPassword, cb) {
	// plainPassword : 123456789    암호화된 비밀번호 가 같은지 체크해야한다.
	// 플레인패스워드를 암호화 한다음에 디비의 비밀번호와 같은지 확인한다.
	bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
		if(err) return cb(err)
		cb(null, isMatch)
	})
}

userSchema.methods.generateToken = function(cb) {
	var user = this;
	// jsonwebtoken을 이용해서 토큰을 생성하기
	var token = jwt.sign(user._id.toHexString(), 'secretToken')
	// user._id + 'secretToken' 으로 토큰생성
	user.token = token
	user.save(function(err, user){
		if(err) return cb(err) // 에러가 있다면 에러를 전달
		cb(null, user) // 에러가 없다면 에러는 없고(null) 유저정보를 전달
	})
}

const User = mongoose.model('User', userSchema)

module.exports = { User };
