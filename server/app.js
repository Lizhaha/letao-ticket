var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
const resMsg = require('./utils/response');
const jwt = require('jsonwebtoken');
const Token = require('./utils/token');
const conn = require('./utils/db');

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
        res.send(200); //让options尝试请求快速结束
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

// 开始写接口
app.get('/validate', function (req, res) {
    console.log(req.headers.token);
    //解密
    let data = Token.decrypt(req.headers.token);  //将请求头的token取出解密
    console.log(data);
    if (data.token) {
        res.send(resMsg(true, '已经登录了'));
    }else{
      res.send(resMsg(false, '还没登录呢'))
    }
})

app.post('/user/login', function (req, res) {
  let phoneNum = req.body.phoneNum;
  let password = req.body.password;
   // 查询conn.query('sql语句',回调函数)
    const sql =`SELECT * FROM user where phone_num=${phoneNum} and password=${password}`;
    conn.query(sql,(err,result) => {
      if(err) {
        res.send(resMsg(false, '获取数据失败'));
        console.log('获取数据失败'+err.message)
        return;
      } else if (result.length) {
        const token = Token.encrypt({id: result.user_id},'15d'); //将user_id加密，设置有效期15天，返回token
        console.log(result.length);
        res.send(resMsg(true, '登录成功', token));
      } else {
        res.send(resMsg(false, '未找到该用户，请检查账号或密码是否有误'))
      }
   })
})

// 监听
app.listen(8081, function () {
  console.log('success listen...8081');
});
