/**
 * Created by bsj01 on 2018/1/22.
 * 异步修改，操作使用, 多个mutation 用action 封装
 */

import * as types from './mutations-types'
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)

}
