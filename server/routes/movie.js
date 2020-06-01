const express = require('express');
const path = require('path');
const router = express.Router();
const moment = require('moment');
const Util = require('../utils/util');
// const Token = require('../utils/token');
const conn = require('../utils/db');
const formidable = require('formidable');

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
            sql = `select c.*,d.grade from (`+
                `select movie.*,b.box_office from (`+
                    `select SUM(count) as box_office,movie_id from (`+
                        `select \`schedule\`.movie_id,\`order\`.count as count, \`order\`.schedule_id from \`order\`,schedule where \`schedule\`.schedule_id=\`order\`.schedule_id`+
                    `) a GROUP BY movie_id`+
                `) b,movie where b.movie_id=movie.movie_id and b.box_office>20`+
            `)c LEFT JOIN (select movie_id,avg(grade) as grade from movie_grade GROUP BY movie_id) d `+
            `on c.movie_id=d.movie_id`;
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
    // let sql =  `select c.*,e.box_office from (` +
    //         `select a.*,b.grade from `+
    //         `(select movie.*,GROUP_CONCAT(want_look.user_id) as user_list,EXISTS(select * from schedule where unix_timestamp(start_time) > unix_timestamp(now()) and movie_id = ${movieId}) as is_releasing from movie,want_look where movie.movie_id = ${movieId} AND want_look.movie_id = ${movieId}) a ` +
    //         `LEFT JOIN (select movie_id,avg(grade) as grade from movie_grade GROUP BY movie_id) b on a.movie_id=b.movie_id`+
    //         `) c, (select movie_id,sum(count) as box_office from (`+
    //             `SELECT \`schedule\`.schedule_id,\`schedule\`.movie_id,\`order\`.count `+
    //             `from \`order\`,\`schedule\` `+
    //             `where \`schedule\`.schedule_id = \`order\`.schedule_id and movie_id = ${movieId}`+
    //         `) d) e`;
    let sql = `select f.*,g.user_list from (`+
                `select d.*,e.grade from (`+
                    `select c.*,EXISTS(select * from schedule where unix_timestamp(start_time) > unix_timestamp(now()) and movie_id = ${movieId}) as is_releasing from (`+
                        `select movie.*,b.box_office from movie `+
                        `LEFT JOIN (`+
                            `select SUM(count) as box_office,movie_id from (`+
                                `select schedule.movie_id,\`order\`.count as count, \`order\`.schedule_id from \`order\`,schedule where schedule.schedule_id=\`order\`.schedule_id `+
                            `) a GROUP BY movie_id `+
                        `) b on b.movie_id=movie.movie_id`+
                    `) c where c.movie_id=${movieId}`+
                `) d LEFT JOIN (`+
                    `select avg(grade) as grade,movie_id from movie_grade GROUP BY movie_id`+
                `) e on d.movie_id=e.movie_id`+
            `) f LEFT JOIN (`+
                `select GROUP_CONCAT(want_look.user_id) as user_list,movie_id from want_look GROUP BY movie_id`+
            `) g on f.movie_id=g.movie_id`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '搜索失败'));
            console.log('搜索失败'+err.message, sql)
            return;
        } else {
            console.log(sql)
            let userList = result[0].user_list ? result[0].user_list.split(',') : [];
            if (userList.findIndex(item => item === userId || +item === userId) === -1) result[0]['is_want_look'] = false;
            else result[0]['is_want_look'] = true;
            res.send(Util.resMsg(true, `搜索成功`, result[0]));
        }
    });
})

router.get('/comment', function (req, res) {
    let movieId = req.query.movieId;
    const sql = `select movie_grade.*, user.user_id, user.user_name, user.avatar from movie_grade, user where movie_grade.movie_id = ${movieId} and movie_grade.user_id = user.user_id order by movie_grade.grading_time desc`;
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

router.get('/wantLook', function (req, res) {
    let userId = req.query.userId;
    const sql = `select want_look.want_id,movie.movie_id,movie.movie_name,movie.img_url,movie.release_time,movie.director `+
                `from want_look,movie where `+
                `want_look.user_id=${userId} and want_look.movie_id=movie.movie_id order by want_look.want_id desc`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '获取想看列表失败'));
            console.log('获取想看列表失败'+err.message)
            return;
        } else {
            result = result.map((want) => {
                return {
                    want_id: want.want_id,
                    movie_id:want.movie_id,
                    movie_name: want.movie_name,
                    img_url: want.img_url,
                    release_time: moment(want.release_time).format('YYYY-MM-DD'),
                    director: want.director ? want.director.split(',') : []
                }
            });
            res.send(Util.resMsg(true, `想看列表`, result));
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

router.get('/schedule', function(req, res) {
    let movieId = req.query.movieId;
    let date = req.query.date;
    const sql = `select schedule.*, room.room_name, room.column, room.row,room.empty_seats ` +
        `from schedule, room ` +
        `where TO_DAYS(start_time)=TO_DAYS('${date}') and unix_timestamp(start_time)>=unix_timestamp('${date}') and schedule.room_id = room.room_id and schedule.movie_id = ${movieId}`;
    console.log(sql);
    conn.query(sql, (err, result) => {
        if (err) {
            res.send(Util.resMsg(false, '查询排班表失败'));
        } else {
            res.send(Util.resMsg(true, '排班信息', result));
        }
    });
})

router.get('/select', function(req, res) {
    let scheduleId = req.query.scheduleId;
    const sql = `select schedule.*,room.room_name,room.row,room.column,room.empty_seats from schedule,room where schedule.schedule_id = ${scheduleId} and schedule.room_id = room.room_id`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.send(Util.resMsg(false, '查询某一排班相关信息失败'));
        } else {
            res.send(Util.resMsg(true, '查询成功', result[0]));
        }
    });
})

router.get('/allMovie', function(req, res) {
    const searchValue = req.query.searchValue;
    const sql =searchValue ? `select * from movie where movie_name like '%${searchValue}%'` : `select * from movie`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.send(Util.resMsg(false, '查询所有影片信息失败'));
        } else {
            result = result.map((movie) => {
                return {
                    movieId: movie.movie_id,
                    movieName: movie.movie_name,
                    introduction: movie.introduction,
                    releaseTime: moment(movie.release_time).format('YYYY-MM-DD'),
                    movieType: movie.movie_type,
                    timeLength: movie.time_length,
                    director: movie.director,
                    mainActor: movie.main_actor,
                    imgUrl: movie.img_url,
                    region: movie.region
                }
            });
            res.send(Util.resMsg(true, '查询成功', result));
        }
    });
})

router.get('/allRoom', function(req, res) {
    const sql = `select * from room`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.send(Util.resMsg(false, '查询放映厅信息失败'));
        } else {
            result = result.map((room) => {
                return {
                    roomId: room.room_id,
                    row: room.row,
                    column: room.column,
                    emptySeats: room.empty_seats,
                    roomName: room.room_name
                }
            });
            res.send(Util.resMsg(true, '查询成功', result));
        }
    });
})

router.get('/allSchedule', function(req, res) {
    const sql = `select schedule.*,room.room_name,movie.movie_name `+
                `from schedule,room,movie `+
                `where room.room_id = schedule.room_id and schedule.movie_id = movie.movie_id `+
                `GROUP BY schedule.schedule_id `+
                `ORDER BY schedule.start_time desc`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.send(Util.resMsg(false, '查询场次信息失败'));
        } else {
            result = result.map((schedule) => {
                return {
                    scheduleId: schedule.schedule_id,
                    movieId: schedule.movie_id,
                    movieName: schedule.movie_name,
                    startTime: moment(schedule.start_time).format('YYYY-MM-DD HH:mm'),
                    endTime: moment(schedule.end_time).format('HH:mm'),
                    langVersion: schedule.lang_version,
                    price: schedule.price,
                    roomId: schedule.room_id,
                    roomName: schedule.room_name
                }
            });
            res.send(Util.resMsg(true, '查询成功', result));
        }
    });
})

router.put('/deleteMovie', function (req, res) {
    let movieId = req.body.movieId;
    let sql =  `delete from movie where movie_id=${movieId}`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, `删除影片失败`));
            console.log('删除影片失败'+err.message)
            return;
        } else {
            console.log('删除影片成功', result);
            res.send(Util.resMsg(true, '删除影片成功'));
        }
    });
})

router.put('/deleteRoom', function (req, res) {
    let roomId = req.body.roomId;
    let sql =  `delete from room where room_id=${roomId}`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, `删除放映厅失败`));
            console.log('删除放映厅失败'+err.message)
            return;
        } else {
            console.log(result);
            res.send(Util.resMsg(true, '删除放映厅成功'));
        }
    });
})

router.post('/addMovie', function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; // 编码
    form.keepExtensions = true;
    //文件存储路径 最后要注意加 '/' 否则会被存在public下
    form.uploadDir = path.join(__dirname, '../public/images/poster');
    // 解析 formData 数据
    form.parse(req, (err, fields ,files) => {
        if(err) return next(err)
        // 解析上传图片的地址，获取图片名称
        let fileBase = '/static/images/poster/' + path.parse(files.file.path).base
        let sql = `insert into movie SET ?`;
        let movie = {
            movie_name: fields.movieName,
            introduction: fields.introduction,
            release_time: fields.releaseTime,
            movie_type: fields.movieType,
            time_length: fields.timeLength,
            director: fields.director,
            main_actor: fields.mainActor,
            region: fields.region,
            img_url: fileBase
        }
        conn.query(sql, movie, (err) => {
        if(err) {
            res.send(Util.resMsg(false, `添加影片失败`));
            console.log('添加影片失败'+err.message, sql)
            return;
        } else {
            res.send(Util.resMsg(true, `添加影片成功`, {fileBase: fileBase}));
        }
        });
    })
})

router.post('/add', function (req, res) {
    let type = req.body.type;
    let sql = '';
    if (type === 'room') {
        let roomName = req.body.roomName;
        let row = req.body.row;
        let column = req.body.column;
        let emptySeats = req.body.emptySeats;
        let room = {
            room_name: roomName,
            row: row,
            column: column,
            empty_seats: emptySeats
        }
        sql = "INSERT INTO `room` SET ?";
        conn.query(sql,room,(err,result) => {
            if(err) return console.log('添加放映厅失败'+err.message)
            console.log(result);
            res.send(Util.resMsg(true, '添加放映厅成功'));
        })
    } else if (type === 'schedule') {
        let movieId = req.body.movieId;
        let startTime = req.body.startTime;
        let endTime = req.body.endTime;
        let langVersion = req.body.langVersion;
        let price = req.body.price;
        let roomId = req.body.roomId;
        let schedule = {
            movie_id: movieId,
            start_time: startTime,
            end_time: endTime,
            lang_version: langVersion,
            price: price,
            room_id: roomId
        }
        sql = "INSERT INTO `schedule` SET ?";
        conn.query(sql,schedule,(err,result) => {
            if(err) return console.log('添加放映场次失败'+err.message)
            console.log(result);
            res.send(Util.resMsg(true, '添加放映场次成功'));
        })
    }
})

router.put('/editMovie', function (req, res, next) {
    console.log('执行编辑');
    console.log(req.body.type);
    if (req.body.type === 'noUpload') {
        let sql = `update movie SET ? where movie_id=${req.body.movieId}`;
        let movie = {
            movie_name: req.body.movieName,
            introduction: req.body.introduction,
            release_time: req.body.releaseTime,
            movie_type: req.body.movieType,
            time_length: req.body.timeLength,
            director: req.body.director,
            main_actor: req.body.mainActor,
            region: req.body.region,
            img_url: req.body.imgUrl
        }
        conn.query(sql, movie, (err) => {
            if(err) {
                res.send(Util.resMsg(false, `编辑影片失败`));
                console.log('编辑影片失败'+err.message, sql)
                return;
            } else {
                res.send(Util.resMsg(true, `编辑影片成功`));
            }
        });
    } else {
        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8'; // 编码
        form.keepExtensions = true;
        //文件存储路径 最后要注意加 '/' 否则会被存在public下
        form.uploadDir = path.join(__dirname, '../public/images/poster');
        // 解析 formData 数据
        form.parse(req, (err, fields ,files) => {
            if(err) return next(err)
            // 解析上传图片的地址，获取图片名称
            let fileBase = '/static/images/poster/' + path.parse(files.file.path).base
            let sql = `update movie SET ? where movie_id=${fields.movieId}`;
            let movie = {
                movie_name: fields.movieName,
                introduction: fields.introduction,
                release_time: fields.releaseTime,
                movie_type: fields.movieType,
                time_length: fields.timeLength,
                director: fields.director,
                main_actor: fields.mainActor,
                region: fields.region,
                img_url: fileBase
            }
            conn.query(sql, movie, (err) => {
            if(err) {
                res.send(Util.resMsg(false, `编辑影片失败`));
                console.log('编辑影片失败'+err.message, sql)
                return;
            } else {
                res.send(Util.resMsg(true, `编辑影片成功`, {fileBase: fileBase}));
            }
            });
        })
    }
})

module.exports = router;