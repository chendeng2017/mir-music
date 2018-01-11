import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((reslove, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        return reslove(data)
      } else {
        reject(err)
      }
    })
  })

}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''   //要是前面有？ 就去掉之后拼接
}




let  url = `${this.a1}${this.a2}`
