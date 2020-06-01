<template>
    <div class="order">
        <el-row :gutter="20" type="flex" v-if="orderList && orderList.length">
            <el-col :span="12" v-for="item in orderList" :key="item.order_id">
                <div :class="['item',item.is_time_end ? 'time-end' : '']">
                    <P class="title">
                        {{item.movie_name}}
                        <span class="time">{{item.start_time}} - {{item.end_time}}</span>
                    </P>
                    <P>取票码：<span class="ticket-code">{{item.ticket_code}}</span></P>
                    <p>
                        <span>￥{{item.price}}</span>
                        <el-tag v-for="seat in item.seat" :key="seat">{{seat}}</el-tag>
                    </p>
                    <img v-if="item.is_time_end" src="../assets/images/timeEnd.svg" alt="">
                </div>
            </el-col>
        </el-row>
        <Empty :emptyType="emptyType" v-else></Empty>
    </div>
</template>

<script>
import { orderList } from '../service/index';
import { mapGetters } from 'vuex';
import Empty from '../components/Empty';
export default {
    data () {
        return {
            orderList: null,
            emptyType: 'null'
        }
    },
    components: {
        Empty
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    mounted () {
        let timer = setInterval(() => {
            if (this.userInfo) {
                clearInterval(timer);
                this.getOrderList();
            }
        }, 200);
    },
    methods: {
        getOrderList () {
            if (this.userInfo) {
                orderList({
                    params: {
                        userId: this.userInfo.userId
                    }
                }).then((res) => {
                    if (res.success) {
                        this.orderList = res.data;
                    } else {
                        this.$message.error(res.message || '获取订单信息失败');
                    }
                }).catch((e) => {
                    console.log(e);
                });
            } else {
                this.$router.push({name: 'login'});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.order {
    font-size: 14px;
    .item {
        width: 100%;
        box-sizing: border-box;
        border: 1px dashed #ccc;
        padding: 0 20px;
        margin: 10px 0;
        .el-tag {
            margin-left: 5px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            .time {
                font-size: 14px;
                font-weight: lighter;
            }
        }
        .ticket-code {
            color: #ea5d41;
            font-weight: bold;
        }
    }
    .time-end {
        position: relative;
        color: #ccc;
        .el-tag {
            background: #ccc;
            color: #fff;
            border: none;
        }
        img {
            width: 60px;
            position: absolute;
            top: -6px;
            right: -6px;
        }
        .ticket-code {
            color: #ccc;
        }
    }
    .el-row {
        flex-wrap: wrap;
    }
}
</style>