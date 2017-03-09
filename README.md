## express-handlebars

&emsp;&emsp;这是一个用node做为服务器，用express框架和handlebars视图框架搭的一个例子，以方便供大家参加和使用

### 说明：

#####**1. 安装**

      git clone https://github.com/kunkuntang/express_handlebars.git
      cd express_handlebars
      npm install
或者用国内淘宝镜像：
      cnpm install

#####**2. 启动程序**

      node main.js
或者
      npm start

#####**3. 目录结构：**

```bat
express_handlebars
├─asset
├─node_modules
├─public
│  ├─css
│  ├─img
│  └─js
│    └─plugins
└─views
    ├─layouts
    └─partials

```

- **views**：
&emsp;&emsp;views文件夹是handlebars的视图默认存放的地方,因为在默认情况下，Express会在views子目录中查找视图（ps:别问我为什么，我也不知道
(-_-||)，反正它就是这样子规定的），然后在这个文件夹里放的是各种经过express路由处理过后决定渲染的视图

- **views -> layout**
&emsp;&emsp;layout是一个handlebars存放视图模版的文件夹
（ps:也是规定的，没有为什么，有兴趣可以去看官网，虽然是全英的，但是静下心来翻译一下还是可以看得懂的，如果有发现翻译得好的中文版麻烦留个言跟我说一下 (ˉ﹃ˉ) )

- **views -> partials**
&emsp;&emsp;这个是放局部组件的地方，通常我们会把自己封装好的组件放在这个文件夹里
（ps: 嗯！没错，也是规定的）

- **public**:
&emsp;&emsp;这是一个放浏览器请求服务器各种静态资源的文件夹

- **asset**:
&emsp;&emsp;这是一个放服务器需要的静态资源的文件夹

#####**4. handlebars作用说明**

- **handlebars block expression （块级表达式）**

&emsp;&emsp;块级表达式提供了流程控制、条件执行和可扩展性。例：
```HTML
<ul>
    {{#each personList}}
        <li>
            <span>name: {{name}}</span>
            <span>sex: {{sex}}</span>
            <span>age: {{age}}</span>
        </li>
    {{/each}}
</ul>
```

&emsp;&emsp;在main.js中传入相应的数据：
```JS
app.get('/blockExpression', function(req, res) {
	res.render('blockExpression', {
		personList: [
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
		]
	})
})
```

&emsp;&emsp;更多请去[handlebars官网](http://http://handlebarsjs.com/)查看。

使用全局变量 res.locals.

- **handlebars default layout （默认布局）**

&emsp;&emsp;在大部分情况下页面都是会采用相同的布局，比如说每页的head,title,header,footer，如果每一页都要写上一个footer的话会很烦人，这时就要使用handlebars的默认布局了，要使用默认布局，就要在引用handlebars的时候传入默认布局：

###### main.js
```JS
var handlebars = require('express3-handlebars').create(
	{
		defaultLayout: 'main'
	});
```
&emsp;&emsp;比如说这里我使用了默认布局main.handlebars（可以在layout文件夹里找到），这样每一个页面都根据main.hanldebars来渲染页面，内容会插入在{{{body}}}里。

###### main.hanldebars
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	{{{body}}}
</body>
</html>
```

- **handlebars custom layout （自定义布局）**

&emsp;&emsp;但是有时候有些页面会有特殊的需求，希望使用这个页面特有的布局，不想使用默认的布局，那么就要express处理路由里传入自定义的布局：

###### main.js
```JS
app.get('/custom', function (req, res) {
	res.render('customLayout', { layout: 'custom' })
})
```
&emsp;&emsp;要在使上面的代码生效，要在views目录下的layout文件夹下创建一个handlebars布局文件（比如这里的custom.handlebars，可以在layout里找到）

###### custom.handlebars
```handlebars
app.get('/custom', function (req, res) {
	res.render('customLayout', { layout: 'custom' })
})
```

- **handlebars null layout （不使用布局）**

如果要完全不使用布局，也可以在路由处理中传入null:
```JS
app.get('/nolayout', function (req, res) {
	res.render('noLayout', { layout: null })
})
```

- **handlebars partials （组件）**

组件和模块是现在非常流行的一个概念，要在hanglebars里使用组件，首先要在partials文件夹里新建一个组件（比如这里的panel.hanglebars），然后就可以在页面里简单地使用这个组件了：
```JS
<h1>panel partials page</h1>
{{> panel}}
<small>above is the partials usage</small>
```

- **handlebars sections （段落）**

&emsp;&emsp;使用布局可以很快速地在每一个页面是展示相同的内容，但是如果想在要布局中添加不同的元素，比如head里引用的css又或者是js（虽然你可以在body里添加link或者script，但是这样写并不优雅），那么就会用到段落了：
&emsp;&emsp;在main.js里引用handlebars的时候添加一个自定义helper

###### main.js
```JS
var handlebars = require('express3-handlebars').create(
	{
		defaultLayout: 'main',
		helpers: {
			section: function (name, options) {
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			}
		}
	});
```
&emsp;&emsp;helpers在handlebars中是一个非常重要而有强大的地方，通过写自定义helpers可以让你实现你想要做到的功能，具体可以在[官网](http://http://handlebarsjs.com/)查到。

&emsp;&emsp;在**views（注意是views）**目录下新建一个sectionTest.handlebars:
```HTML
{{#section 'head'}}
	<meta name="root" content="noindex">
{{/section}}

<h1>Test Page</h1>
<p>We're testing some jQuery stuff</p>
<a href="/">back</a>

{{#section 'jquery'}}
	<script>
	$('document').ready(function () {
		$('h1').html('jQuery Works');
	});
	</script>
{{/section}}
```

&emsp;&emsp;然后你就可以在布局中使用它了：

###### sectionLayout.handlebars
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	{{{_sections.head}}}
</head>
<body>
	This is sectionLayout
	{{{body}}}
	<script src="/js/plugins/jquery-3.1.1.min.js"></script>
	{{{_sections.jquery}}}
</body>
</html>
```

- **express static path （静态目录）**

&emsp;&emsp;设置静态目录是为在简化在浏览器请求服务器时所写的URL地址：
```JS
app.use(express.static(__dirname + '/public'));
```

&emsp;&emsp;在设置了以上代码之后，浏览器的URL就可以省略 public 来请求 /public下的资源。比如要请求 public目录下的jquery可以写成:

```JS
<script src="/js/plugins/jquery-3.1.1.min.js"></script>
```

&emsp;&emsp;而不是：
```JS
<script src="/public/js/plugins/jquery-3.1.1.min.js"></script>
```

- **render view context object（渲染视图上下文对象）**

&emsp;&emsp;有时候可能在调用第三方API后获取到所需要的数据，然后这些数据希望在任何页面上使用（当你设计了一个组件，而这个组件需要用到这些数据的时候），如果将这些数据一个个传express处理路由显然是不现实的，因此就需要使用到res.locals对象。
&emsp;&emsp;这个对象包含了请求作用域中可以响应的本地变量，因此只有在得到请求或者响应之后进行渲染视图的时候才可访问得到。（[解释原文](http://http://www.expressjs.com.cn/4x/api.html#res.locals)）也就是说可以在任意的渲染视图上下文中使用到。
&emsp;&emsp;例：

##### main.js
```JS
// 先模拟一些数据
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

// 使用中间件把数据赋值到res.locals对象中
app.use(function(req, res, next) {
	if(!res.locals.peopleList) {
		res.locals.peopleList = peopleData
	}
	next() //使用中间件后如果还想继续走下去必须要调用next()函数
})
```

&emsp;&emsp;然后就可以在视图中使用peopleList这个对象了

###### localsTest.handlebars
```HTML
this is a page for res.locals object testing
<ul>
    {{#each peopleList}}
        <li>
            <span>name: {{name}}</span>
            <span>sex: {{sex}}</span>
            <span>age: {{age}}</span>
        </li>
    {{/each}}
</ul>
```

- simplify the handlebars files extensions （简化handlebars的后缀名）

有时候在新建文件的时候会觉得**.handlebars**这样的后缀名太多，无论是出于麻烦还是美观，我都觉得把它缩减是比较好的，如果你想你可以这样在引入视图模版的时候配置扩展名选项 **extname**：
```JS
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
		extname: '.hbs'
	});
```

- sub path usage in the view (在视图中实用子路径)

当你的项目开始有比较多的页面的时候，你可能会想用文件夹来分开它们，那么是可行的，假如你正在要实用一个局部文件，它在 views/partials/social目录下，你可以在视图中这样子引用到它：
```HTML
{{> social/facebook}}
```


