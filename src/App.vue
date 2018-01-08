<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <transition name="router-fade" mode="out-in">
     <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header.vue'
  import tab from 'components/tab/tab.vue'
  export default {
    components: {
      MHeader,
      tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"  type="text/stylus">
  .router-fade-enter-active, .router-fade-leave-active
    transition: opacity .3s
  .router-fade-enter, .router-fade-leave-active
    opacity: 0;

</style>
