import {playMode} from 'common/js/config'
const state = {
  //要传递的数据
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex:-1,
  disc:{},
  topList:{}

}
export default state
