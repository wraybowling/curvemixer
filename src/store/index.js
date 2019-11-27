import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const svg = `<g>
<circle cx="800" cy="50" r="100"/>
</g>`

export default new  Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    svg: svg
  },
  mutations: {
    select(state,payload){
      for(var key in payload){
        state[key] = payload[key]
      }
    }
  }
})
