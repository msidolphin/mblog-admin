/**
 * Created by msidolphin on 2018/3/28.
 */
import types from '@/store/types'

const actions = {
  [types.SET_QUERY_PARAMS]({commit}, payload) {
    commit(types.SET_QUERY_PARAMS, payload)
  }
}

export default actions
