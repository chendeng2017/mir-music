<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default{
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {   //监听gcsroll是否需滚动
        type: Boolean,
        default: false
      }
    },
    mounted(){
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll(){
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {  //初始化时候监听滚动事件，拿到滚动位置
          let me = this  //保留vue实例的scroll
          this.scroll.on('scroll', (pos) => {
            //拿到pos这个位置  派发个事件出去
            me.$emit('scroll', pos)  //（pos 是个对象有X Y轴的属性）

          })
        }
      },
      disable(){
        this.scroll && this.scroll.disable()
      },
      enable(){
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo(){  //调用自带的scoollto方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)  //apply是因为scrollto需要接受参数
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }

    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }

</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>

</style>
