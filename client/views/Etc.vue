<template>
    <div class="ect">
        <div v-if="cinemaMsg">
            <p>
                影院地址：{{cinemaMsg.address}}
            </p>
            <p>
                联系方式：{{cinemaMsg.contact}}
            </p>
            <p>
                营业时间：{{cinemaMsg.businessHours}}
            </p>
            <p>
                其他：{{cinemaMsg.remarks}}
            </p>
        </div>
        <p v-else>加载中...</p>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
    data () {
        return {
        }
    },
    computed: {
        ...mapGetters([
            'cinemaMsg'
        ])
    },
    mounted () {
    },
    methods: {
    }
}
</script>