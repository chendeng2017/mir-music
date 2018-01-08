<template>
  <div class="m-herder">
    <div class="icon"></div>
    <h1 class="text">Mirchen Music</h1>
    <div class="mine">
      <i class="icon-mine"></i>
    </div>

  </div>
</template>

<script>

  export default {

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"  type="text/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
.m-herder
  position relative
  display: flex
  height: 44px
  text-align: center
  color: $color-theme
  justify-content center
  align-items center
  box-sizing border-box
  font-size 0
  .icon
    display: inline-block
    vertical-align: top
    width: 30px
    height: 32px
    margin-right: 9px
    bg-image('logo')
    background-size: 30px 32px
  .text
    display: inline-block
    vertical-align: top
    line-height: 44px
    font-size: $font-size-large
  .mine
    position: absolute
    top: 0
    right: 0
    .icon-mine
      display: block
      padding: 12px
      font-size: 20px
      color: $color-theme

</style>
