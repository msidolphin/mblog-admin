/**
 * Created by msidolphin on 2018/4/5.
 */

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const user = {
  state: {
    redirect: '/dashboard', //首次访问
    user: {}
  },
  actions,
  getters,
  mutations
}

export default user
