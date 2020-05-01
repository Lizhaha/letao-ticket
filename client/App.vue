<template>
  <div id="app">
    <Header></Header>
    <div>
      <router-view/>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import {validate} from './service/index';
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
export default {
  components: {
    Header,
    Footer
  },
  mounted () {
    validate().then((res) => {
      if (!res.success) {
        this.$router.replace({path: '/login'});
      } else {
        this.$router.replace({path: '/'});
      }
    });
  }
}
</script>

<style lang="scss">
#app {
  padding: 0 20px;
}
</style>
