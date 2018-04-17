/**
 * Created by msidolphin on 2018/4/5.
 */
import types from '@/store/types'

const mutations = {
  [types.SET_REDIRECT](state, value) {
    state.redirect = value
  },
  [types.SET_USER](state, user) {
    state.user = user
  }
}

export default mutations
