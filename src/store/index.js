/**
 * Created by msidolphin on 2018/3/28.
 */
import Vuex from 'vuex'
import Vue from 'vue'

import query from './module/query'
import user from './module/user'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
      query,
      user
    }
})

export default store
