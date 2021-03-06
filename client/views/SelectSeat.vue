<template>
    <div :class="['select-page',isVisitByPhone ? 'inPhone' : '']" v-if="userSelect">
        <div class="select">
            <div class="legend">
                <span class="item">
                    <i class="seat-off"></i>
                    <span>可选座位</span>
                </span>
                <span class="item">
                    <i class="seat-selected"></i>
                    <span>已售座位</span>
                </span>
                <span class="item">
                    <i class="seat-checked"></i>
                    <span>已选座位</span>
                </span>
            </div>
            <div class="select-area">
                <el-row v-for="row in userSelect.row" :key="row" type="flex">
                    <span class="num">{{row}}</span>
                    <el-col :span="3" v-for="column in userSelect.column" :key="column">
                        <i
                            :data-row="row"
                            :data-column="column"
                            :ref="'seat'+row+'-'+column"
                            :class="['seat', getSeatType(row, column)]"
                            @click="handleClickSeat"></i>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="movie-msg">
            <h3>{{$route.query.movieName}}</h3>
            <p>放映厅：{{userSelect.room_name}}</p>
            <p>场次：{{userSelect.start_time}}（散场：{{userSelect.end_time}}）</p>
            <p>票价：<span class="price">{{userSelect.price}}元</span> / 张</p>
            <div class="checked" v-if="checkedSeats && checkedSeats.length">
                <p>已选座位：</p>
                <el-tag v-for="item in checkedSeats" :key="item.row + ''+ item.column">
                    {{item.row}}排{{item.column}}座
                </el-tag>
                <p>总价：<span class="price">{{totalPrice}}元</span></p>
                <el-button type="primary" size="medium" @click="handleGoPay">确认，去付款</el-button>
            </div>
            <p class="tip" v-else><i class="el-icon-warning-outline" style="margin-right: 5px"></i>请选择您的观影位置</p>
        </div>
        <el-dialog :class="['pay-way', isVisitByPhone ? 'pay-dialog' : '']" title="请选择您的支付方式" :visible.sync="isShowPay">
            <div class="content">
                <h1>￥{{totalPrice}}元</h1>
                <el-radio v-model="payWay" label="1">
                    <i class="wechat"></i>
                    <span>微信支付</span>
                </el-radio>
                <el-radio v-model="payWay" label="2">
                    <i class="alipay"></i>
                    <span>支付宝</span>
                </el-radio>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button
                    type="primary"
                    @click="handleCheckPay"
                    :loading="isLoading"
                >付 款</el-button>
            </div>
        </el-dialog>
    </div>
    <Empty :emptyType="emptyType" v-else></Empty>
</template>

<script>
import { getSelectedSeat, getUserSelect, submitOrder } from '../service/index';
import { mapGetters } from 'vuex';
import moment from 'moment';
import Empty from '../components/Empty';

function isContainSeat(seatsArray, row, column) {
    let bool = false;
    let pos = -1;
    seatsArray.forEach((item, index) => {
        if (item.row === row && item.column === column) {
            bool = true;
            pos = index;
        }
    });
    return {
        isContain: bool,
        position: pos
    };
}

export default {
    data () {
        return {
            selectedSeats: null,
            checkedSeats: [],
            userSelect: null,
            emptyType: 'error',
            isShowPay: false,
            isLoading: false,
            payWay: '1'
        }
    },
    components: {
        Empty
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'isVisitByPhone'
        ]),
        totalPrice () {
            return (this.userSelect.price * this.checkedSeats.length).toFixed(2);
        }
    },
    mounted () {
        this.getUserSelect(() => {
            this.getSelectedSeat();
        });
    },
    methods: {
        getUserSelect (callback) {
            getUserSelect({
                params: {
                    scheduleId: this.$route.query.scheduleId
                }
            }).then((res) => {
                if (res.success) {
                    let data = res.data;
                    data.start_time = moment(data.start_time).format('MM月DD日 HH:mm');
                    data.end_time = moment(data.end_time).format('HH:mm');
                    data.price = data.price.toFixed(1);
                    if (data.empty_seats) {
                        data.empty_seats = data.empty_seats.split(',').map(item => {
                            let temp = item.split('-');
                            return {
                                row: +temp[0],
                                column: +temp[1]
                            }
                        });
                    }
                    this.userSelect = data;
                    if (callback) callback();
                }
            })
        },
        getSelectedSeat () {
            getSelectedSeat({
                params: {
                    scheduleId: this.userSelect.schedule_id
                }
            }).then((res) => {
                if (res.success) {
                    if (res.data) {
                        let data = res.data;
                        data = data.split(',');
                        data = data.map((item) => {
                            let temp = item.split('-');
                            return {
                                row: +temp[0],
                                column: +temp[1]
                            }
                        });
                        this.selectedSeats = data;
                    }
                } else {
                    console.log(res.message);
                }
            }).catch((e) => {
                console.log(e);
            });
        },
        getSeatType (row, column) {
            let seatClass = 'seat-off';
            if (this.userSelect.empty_seats && isContainSeat(this.userSelect.empty_seats, row, column).isContain) {
                seatClass = '';
            } else if (this.selectedSeats && isContainSeat(this.selectedSeats, row, column).isContain) {
                seatClass = 'seat-selected';
            }
            return seatClass;
        },
        handleClickSeat (el) {
            let row = +el.target.dataset.row;
            let column = +el.target.dataset.column;

            // 选中已售座位
            if (this.selectedSeats && this.selectedSeats.length && isContainSeat(this.selectedSeats, row, column).isContain) return;

            // 选中已选座位
            if (this.checkedSeats && this.checkedSeats.length) {
                let containResult = isContainSeat(this.checkedSeats, row, column);
                if (containResult.isContain) {
                    let refName = 'seat' + row + '-' +column;
                    this.$refs[refName][0].setAttribute('class', 'seat seat-off');
                    this.checkedSeats.splice(containResult.position, 1);
                    return;
                }
            }
            
            // 选中普通座位
            let refName = 'seat' + row + '-' +column;
            this.$refs[refName][0].setAttribute('class', 'seat seat-checked');
            this.checkedSeats.push({
                row: row,
                column: column
            });
        },
        handleGoPay () {
            this.isShowPay = true;
        },
        handleCheckPay () {
            this.isLoading = true;
            let seat = this.checkedSeats.map((item) => {
                return item.row + '-' + item.column;
            }).join(',');
            submitOrder({
                scheduleId: this.userSelect.schedule_id,
                userId: this.userInfo.userId,
                seat: seat
            }).then((res) => {
                if (res.success) {
                    this.isShowPay = false;
                    this.isLoading = false;
                    this.$message.success('支付成功');
                    this.$router.push({name: 'order'});
                } else {
                    this.isLoading = false;
                    this.$message.error(res.message || '支付出错');
                }
            }).catch((e) => {
                console.log(e);
                this.isLoading = false;
                this.$message.error('网络错误，请稍后再试');
            });
        },
        handleCancel () {
            this.isLoading = false;
            this.isShowPay = false;
        }
    }
}
</script>

<style lang="scss">
    .select-page {
        display: flex;
        .select {
            margin-right: 20px;
            box-sizing: border-box;
            flex: 3;
            .legend {
                margin-bottom: 10px;
                .item {
                    margin-right: 10px;
                    i {
                        margin-right: 5px;
                    }
                    span {
                        position: relative;
                        top: -6px;
                    }
                }
            }
            .seat {
                display: inline-block;
                cursor: pointer;
            }
            .select-area {
                border: 1px solid #e5e5e5;
                padding: 15px;
                .num {
                    width: 30px;
                    display: inline-block;
                    margin-right: 20px;
                }
            }
        }
        .movie-msg {
            flex: 2;
            .el-tag {
                margin-right: 5px;
                margin-bottom: 5px;
            }
            .tip {
                background: #E6A23C;
                color: #fff;
                height: 30px;
                line-height: 30px;
                text-align: center;
            }
        }
        .seat-selected {
            cursor: not-allowed !important;
        }
        .seat-off::before {
            width: 24px;
            display: inline-block;
            content: url(../assets/images/seat-off.svg);
        }
        .seat-selected::before {
            width: 24px;
            display: inline-block;
            content: url(../assets/images/seat-selected.svg);
        }
        .seat-checked::before {
            width: 24px;
            display: inline-block;
            content: url(../assets/images/seat-checked.svg);
        }
        .pay-way {
            .content {
                margin-top: -10px;
            }
            h1 {
                text-align: center;
            }
            .wechat, .alipay {
                display: inline-block;
                position: relative;
                top: 10px;
            }
            .wechat::after {
                width: 32px;
                height: 32px;
                display: inline-block;
                content: url(../assets/images/wechat.svg);
            }
            .alipay::after {
                width: 32px;
                height: 32px;
                display: inline-block;
                content: url(../assets/images/alipay.svg);
            }
        }
        &.inPhone {
            flex-direction: column;
            .select {
                margin-right: 0;
            }
            .seat {
                margin: 0 2px;
            }
            .seat-off::before {
                width: 17px;
            }
            .seat-selected::before {
                width: 17px;
            }
            .seat-checked::before {
                width: 17px;
            }
            .num {
                display: none !important;
            }
        }
    }
    
.pay-dialog {
    .el-dialog{
        width: 80%;
    }
}
</style>