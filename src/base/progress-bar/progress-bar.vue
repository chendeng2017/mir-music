<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default{
    props: {
      precent: {
        type: Number,
        default: 0
      }
    },
    created(){
      this.touch = {}   //实例上的对象 ，不同的钩子函数来共享数据，将数据挂载到这个对象
    },
    methods: {
      progressTouchStart(e){
        this.touch.initiated = true   //定义标识为  表示已经初始化
        this.touch.startX = e.touches[0].pageX  //记录点击位置 第一个手指点击的位置
        this.touch.left = this.$refs.progress.clientWidth  //记录点击时候进度条已经偏移多少

      },
      progressTouchMove(e){
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd(e){
        this.touch.initiated = false
        this._triggerPercent()
      },
      _offset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _triggerPercent(){
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth  //运动的距离
        this.$emit('percentChange', percent)

      },
      progressClick(e){
        this._offset(e.offsetX)  //设置点击的位置
        this._triggerPercent()
      }

    },
    watch: {
      precent(newPrecent){
        if (newPrecent >= 0 && !this.touch.initiated) {  // && !this.touch.initiated表示当拖动的时候就不会再改变bar的宽度
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPrecent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }

</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
