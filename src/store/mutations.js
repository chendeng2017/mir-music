/**
 * Created by bsj01 on 2018/1/22.
 *
 */

import * as types from "./mutations-types";

const mutations = {   //mutations 与mutations-types关联用来检测语法  （常量检测不到）
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag){
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list){
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list){
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode){
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index){
    state.currentIndex = index

  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, toplist){
    state.topList = toplist
  }

}

export default mutations
