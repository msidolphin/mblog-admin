/**
 * Created by msidolphin on 2018/4/5.
 */
import types from '@/store/types'

const actions = {
  [types.SET_REDIRECT]({commit}, payload) {
    commit(types.SET_REDIRECT, payload)
  },
  [types.SET_USER]({commit}, payload) {
    commit(types.SET_USER, payload)
  }
}

export default actions
