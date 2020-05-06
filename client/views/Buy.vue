<template>
    <div class="bug-page">
        <h1>{{$route.query.movieName}}</h1>
        <p>影院地址：{{cinemaMsg && cinemaMsg.address ? cinemaMsg.address : '正在获取影院地址...'}}</p>
        <div class="select-time">
            <el-tabs v-model="selectTime" @tab-click="handleClick">
                <el-tab-pane
                    v-for="item in timeList"
                    :key="item.label" 
                    :label="item.label"
                    :name="item.name">
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import moment from 'moment';
export default {
    data () {
        return {
            timeList: [
                {
                    label: moment().format('MM月DD日') + '（今天）',
                    name: moment().format('MM月DD日')
                },{
                    label: moment().add(1, 'd').format('MM月DD日'),
                    name: moment().add(1, 'd').format('MM月DD日')
                },{
                    label: moment().add(2, 'd').format('MM月DD日'),
                    name: moment().add(2, 'd').format('MM月DD日')
                },{
                    label: moment().add(3, 'd').format('MM月DD日'),
                    name: moment().add(3, 'd').format('MM月DD日')
                }
            ],
            selectTime: moment().format('MM月DD日')
        }
    },
    computed: {
        ...mapGetters([
            'cinemaMsg'
        ])
    }
}
</script>