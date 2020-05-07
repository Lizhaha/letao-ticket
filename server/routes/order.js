const express = require('express');
const router = express.Router();
// const moment = require('moment');
const Util = require('../utils/util');
// const Token = require('../utils/token');
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

module.exports = router;