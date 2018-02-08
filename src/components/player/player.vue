<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%" alt="">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdwrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>

          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <span class="progress-bar-wrapper">
              <ProgressBar @percentChange="onProgressBarChange" :precent="precent"></ProgressBar>
            </span>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>

          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="palyIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" width="40" height="40" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :precent="precent">
            <i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
          </progress-circle>

        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio @ended="end" ref="audio" :src="currentSong.url" @canplay="ready" @error="error"
           @timeupdate="updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Lyric from 'lyric-parser'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  import Scroll from 'base/scroll/scroll'
  export default{
    data(){
      return {
        songReady: false,   //添加标识位  判断audio标签是否ready 来决定是否切换下一首歌
        currentTime: 0,
        //audio 中timeupdate 会在播放时派发这个事件
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: null
      }
    },
    created(){
      this._getPosAndScale()
      this.touch = {}
    },
    methods: {
      back(){
        this.setFullScreen(false)
      },
      open(){
        this.setFullScreen(true)
      },
      changeMode(){ //改变播放模式
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)  //如果播放模式是随机的则让有序列表洗牌打乱
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list) //当playlist改变时候currentindex来保证currentid不改变
        this.setPlayList(list) //将播放列表设置为当前打乱的列表
      },
      resetCurrentIndex(list){   //切换播放模式的时候当前的currentsong的id是不能变化的 需要重新设置index
        let index = list.findIndex((item) => { //es6语法
          return item.id === this.currentSong.id //在列表里面找到当前歌曲的索引
        })
        this.setCurrentIndex(index)

      },
      togglePlaying(){ //根据vuex设置播放状态
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()  //lyric、对象里面封装得这个歌词的暂停播放方法

        }

      },
      prev(){
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      next(){
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false

      },
      end(){  //audio标签的默认事件，当播放完之后执行
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop(){  //单曲循环
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }

      },
      ready(){
        this.songReady = true
      },
      error(){
        //当网络错误 或者加载失败 歌曲不存在 会加载这个函数  让他能点击找到下一个
        this.songReady = true
      },
      updateTime(e){
        this.currentTime = e.target.currentTime   //audio有currenttime这个属性 ：设置或返回音频/视频中的当前播放位置（以秒计）。
      },
      format(interval){  //将获取的时间戳 做个计算
        interval = interval | 0  //向下取整
        const minute = interval / 60 | 0
        const seconed = this._pad(interval % 60)
        return `${minute}:${seconed}`
      },

      _pad(num, n = 2){   //用来判断当秒只有一位数的时候前面加个0
        let len = num.toString().length
        if (len < n) {
          num = '0' + num
          len++
        }
        return num

      },
      getLyric(){

        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play() //Lyric属性有个play方法
          }
          console.log(this.currentLyric);
        }).catch(() => {  //当不能获取到歌词的时候 清理数据
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0

        })


      },
      handleLyric({lineNum, txt}){
        this.currentLineNum = lineNum
        if (lineNum > 5) {  //控制歌词在中间显示
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)//BScroll的方法
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt  //表示当前的这个歌词
      },
      onProgressBarChange(precent){  //从progress传过来的值来调整播放的时间
        const currentTime = this.currentSong.duration * precent
        this.$refs.audio.currentTime = this.currentSong.duration * precent
        if (!this.playing) {  //当时暂停状态的时候 拖动之后调用播放
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      middleTouchStart(e) {
        this.touch.initated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))  //根据手指滑动的距离来判断歌词页面移动的位置 要么是0 ，要么是负的屏幕的宽度，
        this.touch.precent = Math.abs(offsetWidth / window.innerWidth)
        console.log(this.touch.precent);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)` //scroll是vue的组件是无法直接取到dom 需要去到$el才能设置样式
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.precent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd() {
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.precent > 0.1) {  //从左往右滑动 precent会从0 开始
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }

        } else {
          if (this.touch.precent < 0.9) {  //当屏幕滑动之后到-window。innerwidth时候 从右往左滑动会从1开始减小， this.touch.precent可观察值的变化
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1

          } else {
            offsetWidth = -window.innerWidth
            opacity = 0

          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`

      },
      ...mapMutations({   //mutation的映射
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',  //currentindex切换歌曲原理是 getter里面写了方法  用curretnindex决定currnetsong
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdwrapper, 'move', done)
      },
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdwrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdwrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdwrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdwrapper.addEventListener('transitionend', done)//监听完成动画之后的事件
      },
      afterLeave() {
        this.$refs.cdwrapper.style.transition = ''
        this.$refs.cdwrapper.style[transform] = ''

      },
      _getPosAndScale(){
//        计算出动画过度的位置，从初始位置到过度的位置
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

        return {
          x, y, scale
        }
      }

    },
    computed: {
      //根据播放状态确定图片旋转样式
      cdCls(){
        return this.playing ? 'play' : 'play pause'

      },
      palyIcon(){
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      iconMode(){
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      disableCls(){
        return this.songReady ? '' : 'disable'
      },
      precent(){  //歌曲播放的比例
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([  //vuex取得所需要的状态
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ]),


    },
    watch: {
      currentSong(newSong, oldSong){   //更具url的变化 来确定播放状态
        if (newSong.id === oldSong.id) {   //若果id不变 就直接返回
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()   //currentLyric这个对象中有stop（）来清除计时器，paly（）属性  当页面存在currentLyric时候就清除当前的这个计时器来执行下一个更新的lyric
        }

        this.$nextTick(() => {    //需要再dom加载完成之后 来获取dom
          this.$refs.audio.play()  //currentLyric里面的计时器执行play方法
          this.getLyric()
        })
      },
      playing(newPlaying){
        const audio = this.$refs.audio
        setTimeout(() => {   //需要再dom加载完成之后 来获取dom
          newPlaying ? audio.play() : audio.pause()
        }, 1000)//这里不用#nexttick是为了保证微信端 后台前台切换能保证歌曲正常重新播放

      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
