/**
 * Created by bsj01 on 2018/1/8.
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }//如果dom对象有calssname 直接返回

  // 获取calssname
  let newClass = el.className.split(' ')//拆开classsname
  newClass.push(className)
  el.className = newClass.join(' ')

  // 先把他拆成数组，然后push进去，然后join链接起来  完成cals的添加
}

//判断是否有class
export function hasClass(el, className) {
  //正则判断是否有calass
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  //                   calss（\表示转移） 前面是空白字符    空白自负结束
  return reg.test(el.calssName)
}

//获取index 是个基础的dom操作  提取出来
export function getData(el, name, val) {
  // 有val 就set  没有就get
  const prefix = 'data-'  // 获取data-···的数据
   name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}




//浏览器能力检测 当js需要兼容浏览器时候  自动判断 去加载前缀
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
