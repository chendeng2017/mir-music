export default class Song {
  //创建个song类 构造一个对象
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`


  })

}

function filterSinger(singer) {   //siner在musicData里面以数组形式存放 需要转换为字符串
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
'http://dl.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?vkey=5A29B20CD8201F59820CDA950E2DD1F5AC29C1DE264313719EA7FA9CC7CFC7E4CA5B18F0588DAB91C60A1B7828A5F1DD99FE520DBA6E8B2C&guid=375695145&uin=0&fromtag=66'
'http://dl.stream.qqmusic.qq.com/C400001TXSYu1Gwuwv.m4a?vkey=150CA6E6AD58CB7BF2648699D51AE8279AB899344C46304937B34E70B0A00E52CE403C62A42487FF8EC36926AC26106B94A5674AD55BC0B5&guid=375695145&uin=0&fromtag=66'
'http://isure.stream.qqmusic.qq.com/C100004cNNNW0QG6RR.m4a?fromtag=32'
