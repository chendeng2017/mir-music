/**
 * Created by bsj01 on 2018/1/22.
 * 获取映射
 */

export const singer = state => state.singer
export const palying = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = (state) => {
  //根据播放列表的索引去计算当前播放的歌曲
  return state.playlist[state.currentIndex] || {}
}

