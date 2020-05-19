<template>
    <div class="index">
        <el-row type="flex" :gutter="20">
            <el-col :span="isVisitByPhone ? 24 : 4" v-for="item in movieList" :key="item.movieId">
                <el-card :body-style="{ padding: '0px' }">
                    <div class="movie-card" @click="handleJumpToDetail" :data-movie-id="item.movie_id">
                        <img src="../assets/images/defaultImg.svg" class="image" v-if="!item.img_url">
                        <img :src="baseUrl+item.img_url" class="image" v-if="item.img_url">
                        <div style="padding: 14px;">
                            <div class="bottom clearfix">
                            <time class="movie-name">{{item.movie_name}}</time>
                            <el-button type="text" class="right">{{item.grade || item.release_time || '暂无评分'}}</el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <Empty :emptyType="emptyType" v-if="!(movieList && movieList.length)"></Empty>
    </div>
</template>

<script>
import { getMovieList } from '../service/index';
import { mapGetters } from 'vuex';
import Empty from '../components/Empty'
import moment from 'moment';
export default {
    data () {
        return {
            movieList: [],
            emptyType: 'null'
        }
    },
    computed: {
        ...mapGetters([
            'activeType',
            'defaultImg',
            'baseUrl',
            'isVisitByPhone'
        ]),
    },
    components: {
        Empty
    },
    watch: {
        'activeType': {
            handler() {
                this.getMovieList();
            },
            immediate: true
        }
    },
    methods: {
        getMovieList () {
            console.log(this.activeType)
            if (!this.activeType) return;
            getMovieList({
                params: {
                    type: this.activeType
                }
            }).then((res) => {
                if (res.success) {
                    if (this.activeType === 'willRelease') {
                        this.movieList = res.data.map((movie) => {
                            return {
                                'movie_id': movie.movie_id,
                                'movie_name': movie.movie_name,
                                'img_url': movie.img_url,
                                'release_time': moment(movie.release_time).format('YYYY-MM-DD')
                            }
                        });
                    } else {
                        this.movieList = res.data.map((movie) => {
                            return {
                                'movie_id': movie.movie_id,
                                'movie_name': movie.movie_name,
                                'img_url': movie.img_url,
                                'grade': movie.grade ? (+movie.grade).toFixed(1) : movie.grade
                            }
                        });
                    }
                }
            }).catch(() => {
                this.$message.error('网络错误，请稍后重试');
            });
        },
        handleJumpToDetail (e) {
            console.log(e);
            this.$router.push({
                name: 'detail', 
                params: {
                    movieId: e.currentTarget.dataset.movieId
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.index {
    .el-row {
        flex-wrap: wrap;
    }
    .movie-name {
        font-size: 13px;
        color: #999;
    }
    
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .right {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    
    .clearfix:after {
        clear: both
    }
    .movie-card {
        cursor: pointer;
    }
    .el-card {
        margin-bottom: 20px;
    }
}
</style>