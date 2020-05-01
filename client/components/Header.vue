<template>
    <div class="header">
        <el-row>
            <el-col :span="6" class="logo">
                <img src="../assets/images/logo.svg" alt="网站logo" height="56">
            </el-col>
            <el-col :span="10">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">正在热映</el-menu-item>
                    <el-menu-item index="2">即将上映</el-menu-item>
                    <el-menu-item index="3">经典影片</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="8" class="header-right">
                <div class="search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="input2"
                        size="small">
                    </el-input>
                </div>
                <div class="avatar">
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <el-avatar icon="el-icon-user-solid"></el-avatar><i class="el-icon-caret-bottom"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>我的订单</el-dropdown-item>
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            activeIndex: '1'
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    margin-bottom: 20px;
    .logo, .header-right {
        border-bottom: 1px solid #e6e6e6;
    }
    .header-right {
        height: 61px;
        display: flex;
        align-items: center;
        .search {
            flex: 3;
        }
        .avatar {
            flex: 1;
            text-align: right;
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
}
</style>