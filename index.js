const express = require('express'); // 다운받은 모듈을 가져온다.
const app = express() // 모듈의 함수를 이용해서 새로운 app을 생성한다.
const port = 5000 // 어떤 번호이던 상관없다.

// 몽구스를 이용하여 몽고디비와 현재 어플리케이션을 연결한다.
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://qkfma55:qwer1234@youtubebr.fabxc.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModity: false
}).then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err))

app.get('/',(req, res) => { res.send('Hello World!') }) // 루트 디렉토리에 접근하면 문구를 출력한다.

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

