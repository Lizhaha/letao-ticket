<template>
    <div class="footer">
        <div>
            <p @click="$router.push({name: 'etc'})">商业合作</p>
            <p @click="$router.push({name: 'etc'})">联系我们</p>
            <p @click="$router.push({name: 'etc'})">反馈及建议</p>
        </div>
        <span>© 2020 乐淘票 版权所有</span>
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
    .footer {
        margin-top: 20px;
        color: #fff;
        background: #6C6C6C;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        p {
            cursor: pointer;
            padding: 5px 0;
        }
    }
</style>