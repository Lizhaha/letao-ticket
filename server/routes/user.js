const express = require('express');
const router = express.Router();
const Util = require('../utils/util');
const Token = require('../utils/token');
const conn = require('../utils/db');

// 首页路由
router.post('/login', function (req, res) {
    let phoneNum = req.body.phoneNum;
    let password = req.body.password;
    // 查询conn.query('sql语句',回调函数)
    const sql =`SELECT * FROM user where phone_num=${phoneNum} and password=${password}`;
    conn.query(sql,(err,result) => {
      if(err) {
        res.send(Util.resMsg(false, '获取数据失败'));
        return;
      } else if (result.length) {
        const token = Token.encrypt({id: phoneNum},'15d'); //将user_id加密，设置有效期15天，返回token
        res.send(Util.resMsg(true, '登录成功', token));
      } else {
        res.send(Util.resMsg(false, '未找到该用户，请检查账号或密码是否有误'))
      }
    })
})

router.post('/register', function (req, res) {
  console.log(req.body);
    let phoneNum = req.body.phoneNum;
    let password = req.body.password;
    // 查询conn.query('sql语句',回调函数)
    let sql =`SELECT * FROM user where phone_num=${phoneNum}`;
    conn.query(sql,(err,result) => {
      if(err) {
        res.send(Util.resMsg(false, '获取数据失败'));
        return;
      } else if (result.length) {
        res.send(Util.resMsg(false, '该账号已被注册'));
      } else {
        sql = "INSERT INTO `user` SET ?";
        const user = {phone_num: phoneNum, password: password, user_name: phoneNum, is_root: 0}
        conn.query(sql,user,(err,result) => {
            if(err) return console.log('插入数据失败'+err.message)
            console.log(result);
            res.send(Util.resMsg(true, '注册成功'));
        })  
      }
    })
})

router.get('/userInfo', function (req, res) {
  let data = Token.decrypt(req.headers.token);  //将请求头的token取出解密
  if (data.token) {
    const sql =`SELECT * FROM user where phone_num=${data.id}`;
    conn.query(sql,(err,result) => {
      if(err) {
        res.send(Util.resMsg(false, '获取数据失败'));
        return;
      } else if (result.length) {
        res.send(Util.resMsg(true, '', {
          userId: result[0].user_id,
          userName: result[0].user_name,
          phoneNum: result[0].phone_num,
          isRoot: result[0].is_root ? true : false,
          avatar: result[0].avatar
        }))
      } else {
        res.send(Util.resMsg(false, '未找到该用户'));
      }
    })
  }else{
    res.sendStatus(401);
  }
})

module.exports = router;