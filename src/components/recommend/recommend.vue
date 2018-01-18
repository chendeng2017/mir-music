<template>
  <div class="recommend" >
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img  @load="loadImage" class="needsclick" :src="item.picUrl">   <!--better-scroll和fastclick 的click冲突 使用内置needsclick这个class属性就可以可解决冲突问题-->
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-if="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>


<script>
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  export default{
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created(){
//      setTimeout(() => {
//        this._getRecommend()
//      }, 2000)测试scroll 在dom异步加载的时候是否将滚动页面计算正确
      this._getRecommend()

      setTimeout(()=>{
        this._getDiscList()
      },2000)


    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
//            console.log(res.data.slider);
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
//            console.log('取到了');
//            console.log(res.data.list);
            this.discList = res.data.list
          }
        })
      },
      loadImage() {  //这个方法是用来将判断轮播图的高度是否撑开 是否将高度计算到scroll中 如果img加载了 将重新计算scroll 的高度

        if (!this.checkloaded) {
          this.$refs.scroll.refresh()
          this.checkloaded = true   //设置标识位置 让这个逻辑只执行一次
        }
      },
    },
    components: {
      Slider,
      Scroll,
      loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

