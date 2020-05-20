<template>
    <div :class="['want-look', isVisitByPhone ? 'inPhone' : '']">
        <el-row :gutter="20" type="flex">
            <el-col :span="12" v-for="item in wantLookList" :key="item.want_id">
                <div @click="$router.push({name: 'detail', params: {movieId: item.movie_id}})">
                    <el-row class="item" type="flex">
                        <el-col :span="5">
                            <img :src="baseUrl+item.img_url" alt="" width="80">
                        </el-col>
                        <el-col :span="19" :class="[isVisitByPhone ? 'msg' : '']">
                            <P class="title">
                                {{item.movie_name}}
                            </P>
                            <P>上映时间：{{item.release_time}}</P>
                            <p>
                                <el-tag v-for="director in item.director" :key="director">{{director}}</el-tag>
                            </p>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { wantLookList } from '../service/index';
import { mapGetters } from 'vuex';
export default {
    data () {
        return {
            wantLookList: null
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'baseUrl',
            'isVisitByPhone'
        ])
    },
    mounted () {
        let timer = setInterval(() => {
            if (this.userInfo) {
                clearInterval(timer);
                this.getWantLookList();
            }
        }, 200);
    },
    methods: {
        getWantLookList () {
            if (this.userInfo) {
                wantLookList({
                    params: {
                        userId: this.userInfo.userId
                    }
                }).then((res) => {
                    if (res.success) {
                        this.wantLookList = res.data;
                    } else {
                        this.$message.error(res.message || '获取想看列表失败');
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

<style lang="scss">
.want-look {
    font-size: 14px;
    .item {
        width: 100%;
        box-sizing: border-box;
        border: 1px dashed #ccc;
        padding: 0 20px;
        margin: 10px 0;
        align-items: center;
        cursor: pointer;
        .el-tag {
            margin-right: 5px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            .time {
                font-size: 14px;
                font-weight: lighter;
            }
        }
    }
    .el-row {
        flex-wrap: wrap;
    }
    &.inPhone {
        img {
            display: none;
        }
        .el-tag {
            margin-top: 10px;
        }
        .msg {
            width: 100%;
        }
    }
}
</style>