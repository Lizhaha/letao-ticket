<template>
    <div class="empty">
        <img src="../assets/images/error.svg" alt="" v-if="emptyType === 'error'">
        <img src="../assets/images/null.svg" alt="" v-if="emptyType === 'null'">
        <img src="../assets/images/scheduleNull.svg" alt="" v-if="emptyType === 'scheduleNull'">
        <img src="../assets/images/unauthorized.svg" alt="" v-if="emptyType === 'unauthorized'">
    </div>
</template>

<script>
export default {
    props: [
        'emptyType'
    ]
}
</script>

<style lang="scss" scoped>
.empty {
    text-align: center;
    img {
        width: 50%;
    }
}
</style>