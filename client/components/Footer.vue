<template>
    <div class="footer">
        <ul>
            <li>商业合作</li>
            <li>联系我们</li>
            <li>反馈及建议</li>
        </ul>
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
        ul {
            list-style: none;
            li {
                cursor: pointer;
                padding: 5px 0;
            }
        }
    }
</style>