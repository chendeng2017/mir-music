/**
 * Created by bsj01 on 2018/1/22.
 *
 */

import * as types from './mutations-types'

const mutations = {   //mutations 与mutations-types关联用来检测语法  （常量检测不到）
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },

}

export default mutations
