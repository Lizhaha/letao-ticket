import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    activeType: '',
    defaultImg: '../assets/images/loginImg.svg',
    cinemaMsg: null,
    baseUrl: 'http://114.55.254.227:8081',
    // baseUrl: 'http://127.0.0.1:8081',
    isVisitByPhone: false
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
    },
    cinemaMsg (state, msg) {
      state.cinemaMsg = msg;
    },
    isVisitByPhone (state, bool) {
      state.isVisitByPhone = bool
    }
  },
  actions: {
    setUserInfo ({ commit }, userInfo) {
      commit('userInfo', userInfo);
    },
    setActiveType ({ commit }, index) {
      console.log('active index', index);
      commit('activeType', index);
    },
    setCinemaMsg ({ commit }, msg) {
      commit('cinemaMsg', msg);
    },
    setIsVisitByPhone ({ commit }, bool) {
      commit('isVisitByPhone', bool);
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
    },
    cinemaMsg (state) {
      return state.cinemaMsg;
    },
    baseUrl (state) {
      return state.baseUrl
    },
    isVisitByPhone (state) {
      return state.isVisitByPhone;
    }
  },
  modules: {
  }
})
