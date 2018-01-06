<template>
  <div class="recommed">

  </div>
</template>


<script>
  import {getRecommend} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  export default{

    created(){
      this._getRecommend()
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
//            this.recommends = res.data.slider
            console.log(res.data.slider);
          }
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>

