<template>
  <div class="singer">
    <list-view :data="singer" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import { mapMutations } from 'vuex'
  const HOT_SINGER_LEN = 10
  const HOT_NAME = "热门"


  export default{
    data(){
      return {
        singer: []
      }

    },
    created(){
      this._getSingerList()
    },
    methods: {
      selectSinger(singer){
        this.$router.push({
          path: `/singer/${singer.id}`
        })
//        console.log(singer);
        this.setSinger(singer)
      },

      _getSingerList(){
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singer = res.data.list
            this.singer = this._normalizeSinger(res.data.list)
//            this._normalizeSinger(this.singer);
//            console.log(this._normalizeSinger(this.singer));
            console.log(this.singer);
          }
        })
      },
      _normalizeSinger(list){ //整合数据 需要把外层标题和内层数据整合一起
        let map = {
          hot: {  //热门数据 取数据的前十条
            title: HOT_NAME,   //外层的标题
            items: []   //内层的数据  （头像 ， 数据）
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
              //avator已经计算 不用改重复书写
            }))
          }
          const key = item.Findex
          if (!map[key]) {  //判断map中是否有Findex 如果没有
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })

        //得到有序列表需要处理map  1.热门的部分 2.剩下的部分
        let ret = []
        let hot = []
        let reg = /[a-z,A-Z]/g
        for (let key in map) {   //for in 用来遍历数组或者对象的属性
          let val = map[key]
//          console.log(val.title)
//          console.log(val);
          if (val.title === HOT_NAME) {
            hot.push(val)

          } else if (val.title.match(reg)) {// 正则校验  如果是字母
            ret.push(val)

          }

        }
        //对数组开始做个 热门 - a - z 排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
//          charCodeAt(0) 是将所取到的字母转换成Unicode 编码 每个字母代表不同的数字
//          若 a.title.charCodeAt(0) 小于 b.title.charCodeAt(0)在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。所以就会按照abcde 这个顺下排列下去
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },

    components: {
      ListView
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
