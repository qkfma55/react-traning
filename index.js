const express = require('express'); // 다운받은 모듈을 가져온다.
const app = express() // 모듈의 함수를 이용해서 새로운 app을 생성한다.
const port = 5000 // 어떤 번호이던 상관없다.
const bodyParser = require('body-parser')
const { User } = require('./models/User')

const config = require('./config/key')

// application/x-www-form-urlencoded 데이터를 분석해서 가지고 올 수 있게 해준다.
app.use(bodyParser.urlencoded({extended: true}))

// application/json 데이터를 분석해서 가지고 올 수 있게 해준다.
app.use(bodyParser.json())

// 몽구스를 이용하여 몽고디비와 현재 어플리케이션을 연결한다.
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModity: false
}).then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err))

app.get('/',(req, res) => { res.send('Hello World!') }) // 루트 디렉토리에 접근하면 문구를 출력한다.


app.post('/register', (req, res) => {
	// 회원 가입 할때 필요한 정보들을 client에서 가져오면
	// 그것들을 데이터 베이스에 넣어준다.

	// 아래와 같이 json 형태로 req.body를 읽어올 수 있는것은 bodyParser가 있기 때문이다.
	// {
	// 	id: 'hello',
	// 	password: '01234'
	// }
	const user = new User(req.body) // 인스턴스를 만든다.
	// save()는 mongoDB에서 오는 메서드이다. save를 해주면 받아온 req.body가 user 모델에 저장이 되는 것이다.
	user.save((err, userInfo) => {
		// 콜백 펑션 - 에러 발생시 클라이언트에 json 형태로 성공여부와 에러 메시지를 전달해준다.
		if(err) return res.json({ success: false, err })
		// 성공을 했다면, userInfo를 클라이언트에 json형태로 전달해준다. status(200)은 성공했다는 뜻이다.
		return res.status(200).json({
			success: true
		})
	})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

