<template>
    <div class="detail">
        <div v-if="movieDetail" class="main-content">
            <el-row :gutter="20" :class="['movie-msg',isVisitByPhone ? 'inPhone' : '']" v-if="!isVisitByPhone" type="flex">
                <el-col :span="5" class="left-img">
                    <img src="../assets/images/defaultImg.svg" alt="" v-if="!movieDetail || !movieDetail.img_url">
                    <img :src="baseUrl + movieDetail.img_url" alt="" v-else>
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
                            <el-button
                                size="small"
                                type="primary"
                                class="buy-ticket"
                                v-if="movieDetail.is_releasing"
                                @click="$router.push({name: 'buyPage', query: {movieId: movieDetail.movie_id, movieName: movieDetail.movie_name}})"
                            >购票</el-button>
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
            <div :class="[isVisitByPhone ? 'inPhone' : '']" v-else>
                <div class="msg">
                    <h1 class="item movie-name">{{movieDetail.movie_name}}</h1>
                    <p class="item movie-type">
                        <span v-for="type in movieDetail.movie_type" :key="type">{{type}}</span>
                    </p>
                    <p class="item">{{movieDetail.region}} / {{movieDetail.time_length}} 分钟</p>
                    <p class="item">{{movieDetail.release_time}} 上映</p>
                </div>
                <div class="other-msg">
                    <div class="grade-count">
                        <p class="title">本站累计评分</p>
                        <p class="content" v-if="!movieDetail.grade">暂无评分</p>
                        <el-rate
                            v-else
                            v-model="movieDetail.grade"
                            disabled
                            show-score
                            text-color="#fff"
                            score-template="{value}分">
                        </el-rate>
                        <p class="title">{{movieDetail.is_releasing ? '本站累计票房' : '本站想看数'}}</p>
                        <p class="content">{{movieDetail.is_releasing ? movieDetail.box_office : movieDetail.want_look_count}}</p>
                    </div>
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
                        <el-button
                            size="small"
                            class="buy-ticket"
                            v-if="movieDetail.is_releasing"
                            @click="$router.push({name: 'buyPage', query: {movieId: movieDetail.movie_id, movieName: movieDetail.movie_name}})"
                        >购票</el-button>
                    </div>
                </div>
            </div>
            <div class="introduction">
                <h1>剧情介绍</h1>
                <span class="block-text">{{movieDetail.introduction}}</span>
                <h1>演职人员</h1>
            </div>
            <div class="member">
                <div class="director">
                    <h3>导演</h3>
                    <el-tag v-for="item in movieDetail.director" :key="item">{{item}}</el-tag>
                    <el-tag v-if="!movieDetail.director">未知</el-tag>
                </div>
                <div class="actor">
                    <h3>主演</h3>
                    <el-tag v-for="item in movieDetail.main_actor" :key="item">{{item}}</el-tag>
                    <el-tag v-if="!movieDetail.main_actor">未知</el-tag>
                </div>
            </div>
            <div class="comment">
                <h1>评论列表</h1>
                <div v-if="commentList && commentList.length" class="comment-body">
                    <div class="single-comment" v-for="item in commentList" :key="item.comment_id">
                        <el-avatar icon="el-icon-user-solid" v-if="!item.avatar"></el-avatar>
                        <el-avatar :src="baseUrl + item.avatar" v-else></el-avatar>
                        <div class="right">
                            <span :class="['name', item.user_id === userInfo.userId ? 'self' : '']">{{item.user_name}}{{item.user_id === userInfo.userId ? '（我）': ''}}</span>
                            <span class="time">{{item.grading_time}}</span>
                            <el-rate
                                v-model="item.grade"
                                disabled
                                text-color="#c0c4cc"
                                disabled-void-color="#c0c4cc">
                            </el-rate>
                            <p class="block-text">{{item.comment}}</p>
                        </div>
                    </div>
                </div>
                <span v-else>暂无评论信息~</span>
            </div>
        </div>
        <Empty :emptyType="emptyType" v-if="isShowEmpty"></Empty>
        <el-dialog title="评分" :visible.sync="isShowGrading" :class="isVisitByPhone ? 'rate-dialog' : ''">
            <div slot="title">
                <span>点击<i class="el-icon-star-off" style="margin: 0 2px;"></i>进行评分</span>
            </div>
            <div class="content">
                <el-rate v-model="grade" allow-half show-score></el-rate>
                <el-input
                    style="margin-top: 10px;"
                    type="textarea"
                    :rows="3"
                    placeholder="说说您的看法吧~"
                    v-model="comment"
                    :maxlength="300">
                </el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button
                    type="primary"
                    @click="handleSubmitGrade"
                    :loading="isLoading"
                >提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getDetail, wantLook, submitGrade, getCommentList } from '../service/index';
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
            isShowGrading: false,
            grade: 0,
            comment: '',
            isLoading: false,
            commentList: null
        }
    },
    mounted () {
        this.getDetail(this.getCommentList);
    },
    components: {
        Empty
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'baseUrl',
            'isVisitByPhone'
        ])
    },
    methods: {
        getDetail (callback) {
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
                            this.movieDetail.want_look_count = this.movieDetail.user_list && this.movieDetail.user_list.length ? Util.unitConverter(this.movieDetail.user_list.split(',').length) : 0;
                            if (callback) callback();
                        } else {
                            this.$message.error(res.message || '获取详情失败');
                            this.isShowEmpty = true;
                        }
                    }).catch((e) => {
                        console.log(e);
                        this.$message.error("网络错误，请稍后重试");
                        this.isShowEmpty = true;
                    });
                }
            }, 200);
        },
        getCommentList () {
            console.log('执行');
            getCommentList({
                params: {
                    movieId: this.movieDetail.movie_id
                }
            }).then((res) => {
                if (res.success) {
                    this.commentList = res.data;
                }
            }).catch(() => {
                this.$message.error('网络错误，请稍后重试');
            });
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
        handleGrading () {
            this.isShowGrading = true;
        },
        handleCancel () {
            this.isShowGrading = false;
            this.grade = 0;
            this.comment = '';
        },
        handleSubmitGrade () {
            if (!this.grade) {
                this.$message.warning('还未打分哦！');
            } else if (!this.comment) {
                this.$message.warning('说说您的看法再提交吧！');
            } else {
                this.isLoading = true;
                submitGrade({
                    userId: this.userInfo.userId,
                    movieId: this.movieDetail.movie_id,
                    grade: this.grade,
                    comment: this.comment,
                    gradingTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
                }).then((res) => {
                    if (res.success) {
                        this.isShowGrading = false;
                        this.$message.success('已经收到您的打分~');
                        this.getCommentList();
                    } else {
                        this.$message.error(res.message || '提交失败');
                    }
                }).catch(() => {
                    this.$message.error('网络错误，请稍后重试');
                }).finally(() => {
                    this.isLoading = false;
                });
            }
        }
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

<style lang="scss">
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
    .inPhone {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        color: #fff;
        background: #ea5d41;
        position: relative;
        .other-msg {
            flex-direction: column;
            position: relative !important;
            bottom: 0;
        }
        .operate {
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
            .movie-type {
                span {
                    margin-left: 6px;
                }
                span:nth-of-type(1) {
                    margin-left: 0;
                }
            }
        }
        .movie-type {
            span {
                margin-right: 6px;
            }
        }
        .content {
            color: #f7ba2a;
        }
    }
    .member {
        display: flex;
        .el-tag {
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .actor {
            margin-left: 20px;
        }
    }
    .single-comment {
        margin-bottom: 10px;
        display: flex;
        .right {
            flex: 1;
            border-bottom: 1px solid #e5e5e5;
            margin-left: 20px;
            .name {
                display: block;
                margin-bottom: 10px;
            }
            .self {
                color: #ea5d41;
            }
            .time {
                color: #999;
            }
            .el-rate {
                display: inline-block;
                margin-left: 5px;
                position: relative;
                top: -2px;
            }
        }
    }
    .single-comment:last-of-type {
        border-bottom: none;
        margin-bottom: none;
    }
    .block-text {
        line-height: 24px;
    }
}
.rate-dialog {
    .el-dialog{
        width: 80%;
    }
}
</style>