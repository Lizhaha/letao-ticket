var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
const Util = require('./utils/util');
const Token = require('./utils/token');
const user = require('./routes/user');
const movie = require('./routes/movie');
const order = require('./routes/order');

var app = express();
app.use(history({
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    rewrites: [
      {
        from: /^\/.*$/,
        to: function () {
          return "/";
        }
      },
    ]
}));

// 设置跨域
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "*"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS"); //跨域允许的请求方式
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200); //让options尝试请求快速结束
    else
        next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../dist')));

// 访问单页
app.get('/', function (req, res) {
    res.sendFile(path.join(process.cwd(), "client/index.html"));
});

// 验证接口
app.get('/validate', function (req, res) {
    //解密
    let data = Token.decrypt(req.headers.token);  //将请求头的token取出解密
    if (data.token) {
        res.send(Util.resMsg(true, '已经登录了'));
    }else{
      res.sendStatus(401);
    }
})

// 返回影院信息
app.get('/cinema', function (req, res) {
  res.send(Util.resMsg(true, '影院信息', {
    address: '广东省汕尾市陆丰市霞边路7号',
    contact: '0660-0000000',
    businessHours: '10:00 - 22:00',
    remarks: '如有其他想要了解的可以拨打电话联系我们哦~'
  }));
})

//用户相关接口：登录，注册，用户信息
app.use('/user', user);

//电影相关接口：
app.use('/movie', movie);

//订单相关接口：
app.use('/order', order);

// 监听
app.listen(8081, function () {
  console.log('success listen...8081');
});
