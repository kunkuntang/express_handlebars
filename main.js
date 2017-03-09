
var express = require('express')
var port = process.env.PORT || 8080;
var app = express();

// var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});

// 添加helper方法
var handlebars = require('express3-handlebars').create(
	{
		defaultLayout: 'main',
		helpers: {
			section: function (name, options) {
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			}
		},
		// extname: '.hbs'
	});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('view cache', true);

app.use(express.static(__dirname + '/public'));


app.listen(port);

console.log('express-handlebars started on port ' + port);

app.get('/', function (req, res) {
	res.render('home')
})

app.get('/nolayout', function (req, res) {
	res.render('noLayout', { layout: null })
})

app.get('/custom', function (req, res) {
	res.render('customLayout', { layout: 'custom' })
})

app.get('/partialsTest', function (req, res) {
	res.render('partialsTest')
})

app.get('/sectionTest', function (req, res) {
	res.render('sectionTest', {
		layout: 'sectionLayout'
	})
})

var peopleData = [
			{
				name: 'kuntang',
				sex: 'male',
				age: '16'
			},
			{
				name: 'tom',
				sex: 'male',
				age: '21'
			},
			{
				name: 'silly',
				sex: 'female',
				age: '13'
			}
		];

app.get('/blockExpression', function(req, res) {
	res.render('blockExpression', {
		peopleList: peopleData
	})
})

app.use(function(req, res, next) {
	if(!res.locals.peopleList) {
		res.locals.peopleList = peopleData
	}
	next() //使用中间件后如果还想继续走下去必须要调用next()函数
})

app.get('/localsTest', function(req, res) {
	res.render('localsTest')
})

app.get('/subPathTest', function(req, res) {
	res.render('subPathTest')
})
