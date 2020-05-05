<template>
    <div class="detail">
        <div v-if="movieDetail" class="main-content">
            <el-row :gutter="20" class="movie-msg">
                <el-col :span="5" class="left-img">
                    <img src="../assets/images/defaultImg.svg" alt="" v-if="!movieDetail || !movieDetail.img_url">
                    <img :src="movieDetail.img_url" alt="" v-else>
                </el-col>
                <el-col :span="19" class="right-msg">
                    <div class="msg">
                        <span class="item movie-name">{{movieDetail.movie_name}}</span>
                        <span class="item movie-type">
                            <span v-for="type in movieDetail.movie_type" :key="type">{{type}}</span>
                        </span>
                        <span class="item">{{movieDetail.region}} / {{movieDetail.time_length}} 分钟</span>
                        <span class="item">{{movieDetail.release_time}} 上映</span>
                    </div>
                    <div class="other-msg">
                        <div class="operate">
                            <div class="btn-group">
                                <el-button
                                    size="small"
                                    @click="handleWantLook"
                                ><i :class="movieDetail.is_want_look ? 'like-on' : 'like-off'"></i>想看</el-button>
                                <el-button
                                    size="small"
                                    icon="el-icon-star-off"
                                    @click="handleGrading"
                                >评分</el-button>
                            </div>
                            <el-button size="small" type="primary" class="buy-ticket" v-if="movieDetail.is_releasing">购票</el-button>
                        </div>
                        <div class="grade-count">
                            <span class="title">本站累计评分</span>
                            <span class="content" v-if="!movieDetail.grade">暂无评分</span>
                            <el-rate
                                v-else
                                v-model="movieDetail.grade"
                                disabled
                                show-score
                                text-color="#fff"
                                score-template="{value}分">
                            </el-rate>
                            <span class="title">{{movieDetail.is_releasing ? '本站累计票房' : '本站想看数'}}</span>
                            <span class="content">{{movieDetail.is_releasing ? movieDetail.box_office : movieDetail.want_look_count}}</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="introduction">
                <h1>剧情介绍</h1>
                <span>{{movieDetail.introduction}}</span>
                <h1>演职人员</h1>
            </div>
            <div class="member">
                <div class="director">
                    <h3>导演</h3>
                    <el-tag v-for="item in movieDetail.director" :key="item">{{item}}</el-tag>
                </div>
                <div class="actor">
                    <h3>主演</h3>
                    <el-tag v-for="item in movieDetail.main_actor" :key="item">{{item}}</el-tag>
                </div>
            </div>
            <div class="comment">
                <h1>评论列表</h1>
                <!-- <div class="comment-body">
                    <el-avatar icon="el-icon-user-solid" v-if="movieDetail.avatar"></el-avatar>
                    <el-avatar :src="movieDetail.avatar" v-else></el-avatar>

                </div> -->
            </div>
        </div>
        <Empty :emptyType="emptyType" v-if="isShowEmpty"></Empty>
    </div>
</template>

<script>
import { getDetail, wantLook } from '../service/index';
import {mapGetters} from 'vuex';
import Empty from '../components/Empty';
import moment from 'moment';
import Util from '../utils/util'
export default {
    data () {
        return {
            movieDetail: null,
            isShowEmpty: false,
            emptyType: 'error',
            value: 0
        }
    },
    mounted () {
        this.getDetail();
    },
    components: {
        Empty
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    methods: {
        getDetail () {
            let timer = setInterval(() => {
                if (this.userInfo) {
                    clearInterval(timer);
                    getDetail({
                        params: {
                            movieId: this.$route.params.movieId,
                            userId: this.userInfo.userId
                        }
                    }).then((res) => {
                        if (res.success) {
                            this.movieDetail = res.data;
                            this.movieDetail.release_time = moment(this.movieDetail.release_time).format('YYYY-MM-DD');
                            this.movieDetail.movie_type = this.movieDetail.movie_type.split(',');
                            this.movieDetail.box_office = this.movieDetail.box_office ? Util.unitConverter(this.movieDetail.box_office) : this.movieDetail.box_office;
                            this.movieDetail.grade = this.movieDetail.grade ? +((+this.movieDetail.grade).toFixed(1)) : this.movieDetail.grade;
                            this.movieDetail.director = this.movieDetail.director ? this.movieDetail.director.split(',') : this.movieDetail.director;
                            this.movieDetail.main_actor = this.movieDetail.main_actor ? this.movieDetail.main_actor.split(',') : this.movieDetail.main_actor;
                            this.movieDetail.want_look_count = Util.unitConverter(this.movieDetail.user_list.split(',').length);
                        } else {
                            this.$message.error(res.message || '获取详情失败');
                            this.isShowEmpty = true;
                        }
                    }).catch(() => {
                        this.$message.error("网络错误，请稍后重试");
                        this.isShowEmpty = true;
                    });
                }
            }, 200);
        },
        handleWantLook () {
            wantLook({
                userId: this.userInfo.userId,
                movieId: this.movieDetail.movie_id,
                isWantLook: !this.movieDetail.is_want_look == true
            }).then((res) => {
                if (res.success) {
                    this.$message.success(this.movieDetail.is_want_look ? '已取消想看' : '已添加想看');
                    this.getDetail();
                } else {
                    this.$message.error(res.message ? res.message : `${this.movieDetail.is_want_look ? '取消想看失败' : '添加想看失败'}`);
                }
            }).catch(() => {
                this.$message.error('网络错误，请稍后重试');
            });
        },
        handleGrading () {}
    },
    watch: {
        '$route.params': {
            handler (newObj, oldObj) {
                console.log(newObj, oldObj);
                if (oldObj && newObj !== oldObj) {
                    this.getDetail();
                }
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
.main-content {
    font-size: 14px !important;
    .movie-msg {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        color: #fff;
        background: url(../assets/images/background.svg) no-repeat;
        background-size: 100%;
        position: relative;
        .left-img {
            img {
                width: 100%;
                border: 4px solid #fff;
            }
        }
        .right-msg {
            .el-button--small {
                font-size: 14px;
            }
            .msg{
                .item {
                    display: block;
                    margin: 12px 0;
                }
                .movie-name {
                    font-size: 26px;
                    font-weight: bold;
                }
                .movie-type {
                    span {
                        margin-left: 6px;
                    }
                    span:nth-of-type(1) {
                        margin-left: 0;
                    }
                }
            }
            .other-msg {
                width: 100%;
                position: absolute;
                bottom: 60px;
                display: flex;
                align-items: flex-end;
                .operate {
                    flex: 1;
                    .btn-group {
                        display: flex;
                        .el-button--small {
                            flex: 1;
                        }
                        .like-on, .like-off {
                            margin-right: 5px;
                        }
                        .like-on::before {
                            width: 12px;
                            height: 14px;
                            display: inline-block;
                            content: url(../assets/images/like-on.svg);
                        }
                        .like-off::before {
                            width: 12px;
                            height: 14px;
                            display: inline-block;
                            content: url(../assets/images/like-off.svg);
                        }
                    }
                    .buy-ticket {
                        width: 100%;
                        margin-top: 10px;
                    }
                }
                .grade-count {
                    flex: 3;
                    box-sizing: border-box;
                    padding-left: 30px;
                    .title {
                        display: inline-block;
                        margin: 8px 0;
                    }
                    .content {
                        display: block;
                        color: #f7ba2a;
                        font-size: 24px;
                    }
                }
            }
        }
    }
    .member {
        display: flex;
        .el-tag {
            margin-right: 10px;
        }
        .actor {
            margin-left: 20px;
        }
    }
}
</style>