<template>
  <div id="app">
    <Header @change-select="handleChangeSelect"></Header>
    <div>
      <router-view @check="getUserInfo"/>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import { validate, getUserInfo, cinemaMsg } from './service/index';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { mapActions } from 'vuex';
export default {
  components: {
    Header,
    Footer
  },
  methods: {
    ...mapActions([
      'setUserInfo',
      'setActiveType',
      'setCinemaMsg'
    ]),
    validate (callback) {
      validate().then((res) => {
        if (!res.success) {
          this.$router.replace({path: '/login'});
        } else {
          if (this.$route.name === 'login' || this.$route.name === 'register') this.$router.replace({path: '/'});
          callback();
        }
      }).catch(() => {
        this.$router.replace({path: '/login'});
        this.$message.error('登录信息已过期，请重新登录');
      });
    },
    getUserInfo () {
      getUserInfo().then((res) => {
        this.setUserInfo(res.data);
      }).catch(() => {
        this.$message.error('网络错误，请稍后重试');
      })
    },
    handleChangeSelect (activeIndex) {
      this.setActiveType(activeIndex);
      if (this.$route.name !== 'index') this.$router.push({name: 'index'});
    },
    getCinemaMsg () {
      cinemaMsg().then((res) => {
        if (res.success) {
          this.setCinemaMsg(res.data);
        }
      }).catch(() => {
        console.log('获取影院信息失败');
      });
    }
  },
  mounted () {
    this.validate(this.getUserInfo);
    this.getCinemaMsg();
  }
}
</script>

<style lang="scss">
#app {
  padding: 0 20px;
}
</style>
