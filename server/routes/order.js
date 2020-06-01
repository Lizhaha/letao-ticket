const express = require('express');
const router = express.Router();
const moment = require('moment');
const Util = require('../utils/util');
const Token = require('../utils/token');
const conn = require('../utils/db');

router.get('/seat', function (req, res) {
    let scheduleId = req.query.scheduleId;
    const sql = `select * from \`order\` where schedule_id = ${scheduleId}`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '获取已选座位信息失败'));
            console.log('获取已选座位信息失败'+err.message, sql)
            return;
        } else {
            if (result.length) {
                let seat = '';
                result.forEach((element, index) => {
                    seat = index === 0 ? element.seat : seat + ',' + element.seat;
                });
                console.log('已选座位', seat);
                res.send(Util.resMsg(true, `已选座位信息`, seat));
            } else {
                res.send(Util.resMsg(true, `已选座位信息`, ''));
            }
        }
    });
})

router.post('/submit', function (req, res) {
    let userId = req.body.userId;
    let scheduleId = req.body.scheduleId;
    let seat = req.body.seat;
    let ticketCode = Util.getTicketCode(7);
    let count = seat.split(',').length;
    let orderTime = moment().format('YYYY-MM-DD HH:mm:ss');
    //解密
    let data = Token.decrypt(req.headers.token);  //将请求头的token取出解密
    if (data.token) {
        let sql = `insert into \`order\` (user_id, schedule_id, seat,count, ticket_code,order_time) values (${userId}, ${scheduleId}, '${seat}', ${count}, '${ticketCode}', '${orderTime}')`;
        conn.query(sql,(err) => {
            if(err) {
                res.send(Util.resMsg(false, `插入订单信息失败，请重新支付`));
                console.log('插入订单信息失败'+err.message, sql)
                return;
            } else {
                res.send(Util.resMsg(true, `支付成功`));
            }
        });
    }else{
      res.sendStatus(401);
    }
})

router.get('/list', function (req, res) {
    let userId = req.query.userId;
    const sql = `select \`order\`.*,\`schedule\`.*,movie.movie_name ` + 
    `from \`order\`,\`schedule\`,movie ` +
    `where \`order\`.user_id = ${userId} and \`order\`.schedule_id = \`schedule\`.schedule_id and \`schedule\`.movie_id = movie.movie_id ` +
    `order by \`order\`.order_id desc`;
    conn.query(sql,(err,result) => {
        if(err) {
            res.send(Util.resMsg(false, '获取订单信息失败'));
            console.log('获取订单信息失败'+err.message, sql)
            return;
        } else {
            result = result.map((item) => {
                return {
                    order_id: item.order_id,
                    movie_name: item.movie_name,
                    start_time: moment(item.start_time).format('YYYY-MM-DD HH:mm:ss'),
                    end_time: moment(item.end_time).format('HH:mm:ss'),
                    price: item.price,
                    seat: (item.seat.split(',')).map(item => {
                        let temp = item.split('-');
                        return temp[0] + '排' + temp[1] + '座'
                    }),
                    ticket_code: item.ticket_code,
                    is_time_end: moment(item.start_time).isBefore(moment())
                }
            });
            res.send(Util.resMsg(true, `获取订单信息成功`, result));
        }
    });
})

module.exports = router;