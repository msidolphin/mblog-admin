/**
 * Created by msidolphin on 2018/3/28.
 */
import types from '@/store/types'

const mutations = {
  [types.SET_QUERY_PARAMS](state, payload) {
    if(!payload) {
      payload = {}
    }
    state.queryParams = payload
  }
}

export default mutations
