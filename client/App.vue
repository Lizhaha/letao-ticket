<template>
  <div id="app">
    <Header @change-select="handleChangeSelect"></Header>
    <div style="flex:1;padding: 0 20px">
      <router-view @check="getUserInfo" @editSuccess="getUserInfo"/>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import { validate, getUserInfo, cinemaMsg } from './service/index';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { mapActions } from 'vuex';
import Util from './utils/util';
export default {
  components: {
    Header,
    Footer
  },
  methods: {
    ...mapActions([
      'setUserInfo',
      'setActiveType',
      'setCinemaMsg',
      'setIsVisitByPhone'
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
        // this.$message.error('登录信息已过期，请重新登录');
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
        // console.log('获取影院信息失败');
      });
    }
  },
  mounted () {
    this.validate(this.getUserInfo);
    this.getCinemaMsg();
    this.setIsVisitByPhone(Util.visitByPhone());
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  min-height: 100vh;
  box-sizing: border-box;
  // padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.el-table__header-wrapper thead th{
    color: #000;
    background: #BDD1D5;
}
.price {
  color: #ef4238;
}
</style>
