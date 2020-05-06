const express = require('express');
const router = express.Router();
// const moment = require('moment');
const Util = require('../utils/util');
// const Token = require('../utils/token');
const conn = require('../utils/db');

router.get('/list', function (req, res) {
    let type = req.query.type;
    let sql ='';
    switch (type) {
        case 'releasing':
            sql = 'select a.movie_id,a.movie_name,a.img_url,b.grade ' +
                'from (select movie.movie_id,movie.movie_name,movie.img_url ' +
                    'from movie,(select * from `schedule` where unix_timestamp(start_time) > unix_timestamp(now())) temp ' +
                    'where movie.movie_id = temp.movie_id) a ' +
                'LEFT JOIN (select movie_id,avg(grade) as grade from movie_grade GROUP BY movie_id) b ' +
                'on a.movie_id=b.movie_id GROUP BY a.movie_id';
            break;
        case 'willRelease':
            sql = 'select movie.movie_id,movie.movie_name,movie.img_url,movie.release_time ' +
                'from movie ' +
                'where unix_timestamp(release_time) > unix_timestamp(now()) and movie_id not in (' +
                '    select movie_id from `schedule` where unix_timestamp(start_time) > unix_timestamp(now())' +
                ')'
            break;
        case 'hot':
            sql = 'select a.movie_id,a.movie_name,a.img_url,b.grade ' +
                'from (select * from movie where box_office > 1000000000) a ' +
                'LEFT JOIN (select movie_id,avg(grade) as grade from movie_grade GROUP BY movie_id) b ' +
                'on a.movie_id=b.movie_id';
            break;
        default:
            break;
    }
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '获取电影列表失败'));
            console.log('获取电影列表失败'+err.message)
            return;
        } else {
            res.send(Util.resMsg(true, `${type}列表`, result));
        }
    });
})

router.get('/search', function (req, res) {
    let value = req.query.searchValue;
    let sql =  `select * from movie where movie_name like '%${value}%'`
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '搜索失败'));
            console.log('搜索失败'+err.message)
            return;
        } else {
            res.send(Util.resMsg(true, `搜索成功`, result));
        }
    });
})

router.get('/detail', function (req, res) {
    let movieId = req.query.movieId;
    let userId = req.query.userId;
    let sql =  `select a.*,b.grade from `+
            `(select movie.*,GROUP_CONCAT(want_look.user_id) as user_list,EXISTS(select * from schedule where unix_timestamp(start_time) > unix_timestamp(now()) and movie_id = ${movieId}) as is_releasing from movie,want_look where movie.movie_id = ${movieId} AND want_look.movie_id = ${movieId}) a ` +
            `LEFT JOIN (select movie_id,avg(grade) as grade from movie_grade GROUP BY movie_id) b on a.movie_id=b.movie_id`
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '搜索失败'));
            console.log('搜索失败'+err.message, sql)
            return;
        } else {
            let userList = result[0].user_list.split(',');
            if (userList.findIndex(item => item === userId || +item === userId) === -1) result[0]['is_want_look'] = false;
            else result[0]['is_want_look'] = true;
            res.send(Util.resMsg(true, `搜索成功`, result[0]));
        }
    });
})

router.get('/comment', function (req, res) {
    let movieId = req.query.movieId;
    const sql = `select movie_grade.*, user.user_id, user.user_name, user.avatar from movie_grade, user where movie_grade.movie_id = ${movieId} and movie_grade.user_id = user.user_id`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '获取评论列表失败'));
            console.log('获取评论列表失败'+err.message)
            return;
        } else {
            res.send(Util.resMsg(true, `评论列表`, result));
        }
    });
})

router.put('/wantLook', function (req, res) {
    let userId = req.body.userId;
    let movieId = req.body.movieId;
    let isWantLook = req.body.isWantLook;
    let sql =  '';
    if (isWantLook) {
        sql = `INSERT INTO want_look (user_id, movie_id) VALUES (${userId}, ${movieId})`;
    } else {
        sql = `delete from want_look where user_id = ${userId} and movie_id = ${movieId}`;
    }
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, `${isWantLook ? '想看失败' : '取消想看失败'}`));
            console.log('想看操作失败'+err.message)
            return;
        } else {
            console.log('执行想看操作成功', result);
            res.send(Util.resMsg(true, `${isWantLook ? '已为您添加想看' : '已取消想看'}`));
        }
    });
})

router.post('/grading', function (req, res) {
    let userId = req.body.userId;
    let movieId = req.body.movieId;
    let grade = req.body.grade;
    let comment = req.body.comment;
    let gradingTime = req.body.gradingTime;
    let sql = `insert into movie_grade (user_id, movie_id, grade, comment, grading_time) values (${userId}, ${movieId}, ${grade}, '${comment}', '${gradingTime}')`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, `评分失败`));
            console.log('打分失败'+err.message, sql)
            return;
        } else {
            console.log(result);
            res.send(Util.resMsg(true, `评分成功`));
        }
    });
})

module.exports = router;