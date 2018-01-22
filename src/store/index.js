/**
 * Created by bsj01 on 2018/1/22.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'  //es6语法规范 *as 与{actions}相同  表示XXX.XXX()
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'  //在通过mutation 去修改state 时候会看到控制台的日志  修改前后状态
const debug = process.env.NODE_ENV !== 'production'
// state修改检测  是不是通过mutations修改的  否则报错的


Vue.use(Vuex)//注册插件

export default new Vuex.Store({
  //工厂方式创建vuex的实例
  actions,
  getters,
  state,
  mutations,
  strict: debug,   //开发环境的时候开启debug  线上关闭  否则占用资源
  plugins: debug ? [createLogger()] : []
})

