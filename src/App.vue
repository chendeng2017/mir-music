<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header.vue'
  import tab from 'components/tab/tab.vue'
  import Player from 'components/player/player.vue'
  export default {
    components: {
      MHeader,
      tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .router-fade-enter-active, .router-fade-leave-active
    transition: opacity .3s

  .router-fade-enter, .router-fade-leave-active
    opacity: 0;

</style>
