import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    activeType: '',
    defaultImg: '../assets/images/loginImg.svg'
  },
  mutations: {
    userInfo (state, userInfo) {
      state.userInfo = userInfo;
    },
    activeType (state, index) {
      switch (+index) {
        case 1:
          state.activeType = 'releasing';
          break;
        case 2:
          state.activeType = 'willRelease';
          break;
        case 3:
          state.activeType = 'hot';
          break;
        default:
          state.activeType = '';
          break;
      }
    }
  },
  actions: {
    setUserInfo ({ commit }, userInfo) {
      commit('userInfo', userInfo);
    },
    setActiveType ({ commit }, index) {
      console.log('active index', index);
      commit('activeType', index);
    }
  },
  getters: {
    userInfo (state) {
      return state.userInfo;
    },
    activeType (state) {
      return state.activeType;
    },
    defaultImg (state) {
      return state.defaultImg;
    }
  },
  modules: {
  }
})
