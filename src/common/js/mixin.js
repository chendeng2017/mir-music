/**
 * Created by bsj01 on 2018/2/8.
 */
import {mapGetters} from 'vuex'

export const playListMixin = {
  //mixin就是个对象
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    //在domready时候出发
    this.handlePlaylist(this.playlist)
  },

  activated(){
    //在keepalive时候出发
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal){
      this.handlePlaylist(newVal)
    }
  },
  method: {
    handlePlaylist(){
      throw new Error('commponent must implement handlePlayList method')

    }

  }

}
