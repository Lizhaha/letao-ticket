const express = require('express');
const path = require('path');
const router = express.Router();
const Util = require('../utils/util');
const Token = require('../utils/token');
const conn = require('../utils/db');
const formidable = require('formidable');

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

router.post('/uploadAvatar', function(req, res, next){
  let form = new formidable.IncomingForm();
  form.encoding = 'utf-8'; // 编码
  // 保留扩展名
  form.keepExtensions = true;
  //文件存储路径 最后要注意加 '/' 否则会被存在public下
  form.uploadDir = path.join(__dirname, '../public/images/avatar');
  // 解析 formData 数据
  form.parse(req, (err, fields ,files) => {
    if(err) return next(err)
    // 解析上传图片的地址，获取图片名称
    let fileBase = '/static/images/avatar/' + path.parse(files.file.path).base
    let sql = `UPDATE user SET avatar='${fileBase}' WHERE (user_id='${+fields.userId}')`;
    conn.query(sql,(err) => {
      if(err) {
          res.send(Util.resMsg(false, `修改头像失败`));
          console.log('修改头像失败'+err.message, sql)
          return;
      } else {
          res.send(Util.resMsg(true, `修改头像成功`, {fileBase: fileBase}));
      }
    });
  })
});

router.put('/edit', function(req, res){
  let userId = req.body.userId;
  let userName = req.body.userName;
  let sql =`update user set user_name='${userName}' where user_id=${userId}`;
  conn.query(sql,(err,result) => {
    if(err) {
      res.send(Util.resMsg(false, '修改个人信息失败'));
      return;
    } else {
      console.log(result);
      res.send(Util.resMsg(true, '修改个人信息成功'));
    }
  })
});

router.get('/allUser', function(req, res) {
  const searchValue = req.query.searchValue;
  const sql =searchValue ? `select * from user where phone_num like '%${searchValue}%' || user_name like '%${searchValue}%'` : `SELECT * FROM user`;
  conn.query(sql,(err,result) => {
    if(err) {
      console.log(err);
      res.send(Util.resMsg(false, '获取用户数据失败'));
      return;
    } else{
      result = result.map((user) => {
        return {
          userId: user.user_id,
          userName: user.user_name,
          phoneNum: user.phone_num,
          isRoot: user.is_root ? true : false,
          avatar: user.avatar
        }
      })
      res.send(Util.resMsg(true, '', result))
    }
  })
})

router.put('/changeRole', function(req, res) {
  let userId = req.body.userId;
  let isRoot = req.body.isRoot;
  let sql =`update user set is_root=${isRoot ? 1 : 0} where user_id=${userId}`;
  conn.query(sql,(err,result) => {
    if(err) {
      res.send(Util.resMsg(false, '更改用户角色失败'));
      return;
    } else {
      console.log(result);
      res.send(Util.resMsg(true, '更改用户角色成功'));
    }
  })
})

router.put('/deleteUser', function(req, res) {
  let userId = req.body.userId;
  let sql =`delete from user where user_id=${userId}`;
  conn.query(sql,(err,result) => {
    if(err) {
      res.send(Util.resMsg(false, '删除用户失败'));
      return;
    } else {
      console.log(result);
      res.send(Util.resMsg(true, '删除用户成功'));
    }
  })
})

module.exports = router;