<template>
    <div class="buy-page">
        <h1>{{$route.query.movieName}}</h1>
        <p>影院地址：{{cinemaMsg && cinemaMsg.address ? cinemaMsg.address : '正在获取影院地址...'}}</p>
        <div class="select-time">
            <el-tabs v-model="selectTime" @tab-click="handleTabClick">
                <el-tab-pane
                    v-for="item in timeList"
                    :key="item.label" 
                    :label="item.label"
                    :name="item.name">
                </el-tab-pane>
            </el-tabs>
            <el-table
                v-if="scheduleList && scheduleList.length"
                :data="scheduleList"
                style="width: 100%">
                <el-table-column
                    prop="release_time"
                    label="放映时间"
                    min-width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.release_time.start_time}}</span>
                        <span style="display: block; font-size: 12px;">{{scope.row.release_time.end_time}}散场</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="lang_version"
                    label="语言版本"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="room_name"
                    label="放映厅"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="票价"
                    min-width="180">
                    <template slot-scope="scope">
                        <span class="price">{{scope.row.price}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="选座"
                    min-width="180">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleSelectSeat(scope.row)"
                        >选座</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Empty :emptyType="emptyType" v-else></Empty>
        </div>
    </div>
</template>

<script>
import { getSchedule } from '../service/index';
import {mapGetters} from 'vuex';
import moment from 'moment';
import Empty from '../components/Empty';
export default {
    data () {
        return {
            emptyType: 'scheduleNull',
            timeList: [
                {
                    label: moment().format('MM月DD日') + '（今天）',
                    name: moment().format('YYYY-MM-DD')
                },{
                    label: moment().add(1, 'd').format('MM月DD日'),
                    name: moment().add(1, 'd').format('YYYY-MM-DD')
                },{
                    label: moment().add(2, 'd').format('MM月DD日'),
                    name: moment().add(2, 'd').format('YYYY-MM-DD')
                },{
                    label: moment().add(3, 'd').format('MM月DD日'),
                    name: moment().add(3, 'd').format('YYYY-MM-DD')
                }
            ],
            selectTime: moment().format('YYYY-MM-DD'),
            scheduleList: null
        }
    },
    components: {
        Empty
    },
    computed: {
        ...mapGetters([
            'cinemaMsg'
        ])
    },
    mounted () {
        this.handleTabClick(this.selectTime);
    },
    methods: {
        handleTabClick (val) {
            getSchedule({
                params: {
                    movieId: this.$route.query.movieId,
                    date: val.name
                }
            }).then((res) => {
                if (res.success) {
                    let data = res.data;
                    data.forEach((item) => {
                        item.release_time = {};
                        item.release_time.start_time = moment(item.start_time).format('HH:mm');
                        item.release_time.end_time = moment(item.end_time).format('HH:mm');
                    });
                    this.scheduleList = data;
                } else {
                    this.$message.error(res.message || '获取场次信息失败');
                }
            }).catch((e) => {
                console.log(e);
            });
        },
        handleSelectSeat (val) {
            this.$router.push({name: 'selectSeat', query: {
                movieId: this.$route.query.movieId,
                movieName: this.$route.query.movieName,
                scheduleId: val.schedule_id
            }});
        }
    }
}
</script>

<style lang="scss" scoped>
.buy-page {
    .el-table__header-wrapper thead th{
        color: #000;
        background: #BDD1D5 !important;
    }
}
</style>