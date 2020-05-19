<template>
    <div class="header">
        <el-row type="flex" style="align-items:center" v-if="!isVisitByPhone">
            <el-col :span="userInfo ? 6 : 24" class="logo">
                <img src="../assets/images/logo.svg" alt="网站logo" height="56">
            </el-col>
            <el-col :span="10" v-if="userInfo">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">正在热映</el-menu-item>
                    <el-menu-item index="2">即将上映</el-menu-item>
                    <el-menu-item index="3">热门影片</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="8" class="header-right" v-if="userInfo">
                <div class="search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="searchValue"
                        size="small"
                        @input="handleSearchInput">
                    </el-input>
                    <div ref="result" class="result" v-show="isShowResult">
                        <div
                            v-for="item in searchResult"
                            :key="item.movie_id"
                            @click="handleJumpToDetail"
                            :data-movie-id="item.movie_id"
                        >
                            <img src="../assets/images/defaultImg.svg" alt="" v-if="!item.img_url">
                            <img :src="baseUrl + item.img_url" alt="" v-else>
                            <span>{{item.movie_name}}</span>
                        </div>
                    </div>
                </div>
                <div class="avatar">
                    <el-dropdown trigger="click" @command="handleClickMenu">
                        <span class="el-dropdown-link">
                            <el-avatar icon="el-icon-user-solid" v-if="!userInfo.avatar"></el-avatar>
                            <el-avatar :src="baseUrl + userInfo.avatar"></el-avatar>
                            <i class="el-icon-caret-bottom"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0" class="user-name">{{userInfo.userName}}{{userInfo.isRoot ? '（超级管理员）' : ''}}</el-dropdown-item>
                            <el-dropdown-item command="4" v-if="userInfo.isRoot">后台管理</el-dropdown-item>
                            <el-dropdown-item command="1">我的订单</el-dropdown-item>
                            <el-dropdown-item command="5">想看列表</el-dropdown-item>
                            <el-dropdown-item command="2">个人信息</el-dropdown-item>
                            <el-dropdown-item command="3">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
        <div v-else class="inPhone">
            <el-row type="flex" style="align-items:center">
                <el-col :span="userInfo ? 6 : 24" class="logo">
                    <img src="../assets/images/logo.svg" alt="网站logo" height="24">
                </el-col>
                <el-col :span="13" v-if="userInfo">
                    <el-select v-model="activeIndex" @change="handleSelect" placeholder="请选择" size="mini">
                        <el-option label="正在热映" value="1"></el-option>
                        <el-option label="即将上映" value="2"></el-option>
                        <el-option label="热门影片" value="3"></el-option>
                        <el-option label="" value="-1"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" class="header-right" v-if="userInfo">
                    <div class="avatar">
                        <el-dropdown trigger="click" @command="handleClickMenu">
                            <span class="el-dropdown-link">
                                <el-avatar :size="25" icon="el-icon-user-solid" v-if="!userInfo.avatar"></el-avatar>
                                <el-avatar :size="25" :src="baseUrl + userInfo.avatar"></el-avatar>
                                <i class="el-icon-caret-bottom"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="0" class="user-name">{{userInfo.userName}}{{userInfo.isRoot ? '（超级管理员）' : ''}}</el-dropdown-item>
                                <el-dropdown-item command="4" v-if="userInfo.isRoot">后台管理</el-dropdown-item>
                                <el-dropdown-item command="1">我的订单</el-dropdown-item>
                                <el-dropdown-item command="5">想看列表</el-dropdown-item>
                                <el-dropdown-item command="2">个人信息</el-dropdown-item>
                                <el-dropdown-item command="3">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { searchMovie } from '../service/index';
import tokenUtil from '../utils/token';
import { mapActions, mapGetters } from 'vuex';
export default {
    data () {
        return {
            activeIndex: '1',
            searchValue: '',
            inputTimer: null,
            isShowResult: false,
            searchResult: []
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'baseUrl',
            'isVisitByPhone'
        ]),
    },
    mounted () {
        this.setActiveType(this.activeIndex);
        document.onclick = () => {
            this.isShowResult = false;
        };
    },
    methods: {
        ...mapActions([
            'setUserInfo',
            'setActiveType'
        ]),
        handleClickMenu (command) {
            console.log(command);
            switch (command) {
                case '1':
                    this.$router.push({path: '/order'});
                    break;
                case '2':
                    this.$router.push({path: '/personal'});
                    break;
                case '3':
                    this.$message.success("退出成功");
                    this.$router.push({path: '/login'});
                    this.setUserInfo(null);
                    tokenUtil.clearCookie('my_token');
                    break;
                case '4':
                    this.$router.push({path: '/manage'});
                    break;
                case '5':
                    this.$router.push({path: '/wantLook'});
                    break;
                default:
                    break;
            }
        },
        handleSelect (val) {
            this.$emit('change-select', val);
        },
        handleSearchInput (val) {
            if (val) {
                this.inputTimer = setTimeout(() => {
                    clearTimeout(this.inputTimer);
                    searchMovie({
                        params: {
                            searchValue: val
                        }
                    }).then((res) => {
                        if (res.success) {
                            this.searchResult = res.data;
                            this.isShowResult = res.data.length ? true : false;
                        } else {
                            this.$message.error(res.message || '搜索失败');
                        }
                    }).catch(() => {
                        this.$message.error('网络错误，请稍后重试');
                    });
                }, 1000);
            } else {
                this.isShowResult = false;
            }
        },
        handleJumpToDetail (e) {
            this.$router.push({
                name: 'detail', 
                params: {
                    movieId: e.currentTarget.dataset.movieId
                }
            });
        }
    },
    watch: {
        '$route': {
            handler (newObj, oldObj) {
                // 防止登录后跳转到主页时，头部导航未选中
                if (newObj.name === 'index' && (oldObj && (oldObj.name !== 'login' || oldObj.name !== 'register')) ) {
                    this.$nextTick(() => {
                        this.activeIndex = '1';
                        this.setActiveType(this.activeIndex);
                    });
                } else if (newObj.name !== 'index') {
                    this.activeIndex = '-1';
                    this.setActiveType(this.activeIndex);
                }
                // 切换导航时，将搜索框清空
                if (oldObj && (newObj.name !== oldObj.name || newObj.params !== oldObj.path)) {
                    this.searchValue = '';
                }
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    padding: 0 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e6e6e6;
    .header-right {
        height: 61px;
        display: flex;
        align-items: center;
        .search {
            flex: 1;
            position: relative;
            .result {
                width: 100%;
                z-index: 10000;
                position: absolute;
                top: 35px;
                left: 0;
                background: #fff;
                padding: 10px;
                border: 1px solid #DCDFE6;
                font-size: 14px;
                box-sizing: border-box;
                div {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    img {
                        width: 20%;
                    }
                    span {
                        margin-left: 10px;
                    }
                }
            }
        }
        .avatar {
            text-align: left;
            margin-left: 20px;
        }
        .el-dropdown-link {
            cursor: pointer;
            display: inline-block;
            .el-icon-caret-bottom {
                position: relative;
                top: -12px;
            }
        }
    }
    .el-menu {
        border-bottom: none;
    }
    .inPhone {
        .el-input {
            margin-bottom: 20px;
        }
        .el-dropdown-link {
            .el-icon-caret-bottom {
                top: -6px;
            }
        }
    }
}
.user-name {
    color: #ea5d41;
}
</style>