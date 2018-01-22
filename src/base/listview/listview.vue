<template>
  <scroll class="listview"
          @scroll="scroll"
          :data="data"
          :probe-type="probeType"
          ref="listview"
          :listenScroll="listenScroll"

  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchmove.stop.prevent="onShortcutTouchMove"
         @touchstart="onShortcutTouchStart">
      <ul>
        <li class="item"
            v-for="(item,index) in shortcutList"
            :class="{'current':currentIndex===index}"
            :data-index="index"
        >{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>

</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18  //18代表style里面的每个元素的高度

  export default{
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data(){
      return {
        scrollY: -1,
        currentIndex: 0, //当前应该显示的index
        diff: -1  //用来解决fixed的动画问题     原理： 用listGroup的上限减去 scrollY的差 来控制fixed translate3D的偏移量
      }
    },

    computed: {
      shortcutList(){
        return this.data.map((group) => {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle(){ // 计算fixed的title值
        if (this.scrollY > 0) { // 判断在顶部的时候是否需要数据标题
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    created(){
      this.probeType = 3   //betterscroll监听实时滚动需要传数字3
      this.listHeight = [] //给高度赋值
      this.touch = {}  //定义touch获取start 和 move之后的值
      this.listenScroll = true
    },
    methods: {
      selectItem(item){
        this.$emit('select', item)
      },
      onShortcutTouchStart(e){  //(betterscrollyou touch方法)右侧的导航 点击 能让左侧滚动  需要用index去判断
//        1.data-index 变量控制 listcourt里面的index
//        2.用getdata方法获取这个带有data-index的属性的元素 并获取index
//        3.用betterceoll自带的方法让左侧的index和右侧的index联动  让dom滚动到listgroup对应的元素上

        let anchorIndex = getData(e.target, 'index')//        拿到data-index 的index
        let firsTouch = e.touches[0] //获取你按下第一个手指的位置 共享两个函数里面这个位置
        this.touch.y1 = firsTouch.pageY  //将pageY存到touch里面 到时候共享这个值
//        console.log(this.touch.y1);
        this.touch.anchorIndex = anchorIndex  //记录开始点击的index
//        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e){
        //滑动时候能让右侧联动 stop.prevent组织冒泡
//        1.需要start -- move 滚动的位置  计算位置差 确定滚动到第几个元素
//        2.需要start 获取Y  move之后获取Y  然后将Y 计算出来是多少个index
//        与touchstart 共享Y
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
//        console.log(this.touch.y2);
        //计算Y轴上的偏移
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0    // | 0 表示向下取整
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta  //记录移动之后的index   字符串和数字相加会变成新的字符串， 需要先转换成整型数字
//        console.log(anchorIndex);
        this._scrollTo(anchorIndex)
//        this.currentIndex=anchorIndex
      },
      scroll(pos){
        this.scrollY = pos.y  //观测better滚动的y的位置 scroll传过来的值
      },
      _calculateHeight(){ //计算滚动的高度
        this.listHeight = []
        const list = this.$refs.listGroup   //拿到listGroup到list的高度
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight
          this.listHeight.push(height)

        }

      },
      _scrollTo(index){
        //封装这个滚动的方法
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
//        上面代码用来判断滑动时候的index值


        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)  //0表示滚动动画的时间
        this.scrollY = -this.listHeight[index]
      }

    },
    watch: {  //watch里面监控是个函数
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY){   //watch里面监控scrolly的变化然后给currentindex去赋值
//        console.log(newY);
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }

        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
          // 当滚动到底部，且-newY大于最后一个元素的上限
          this.currentIndex = listHeight.length - 2

        }

      },
      diff(newVal) {  //得到diff 的值 检测高度的变化  去添加过度效果
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0

        //如果滚动的newval在顶部  并且

        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop

        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },


    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
