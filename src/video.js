import createTexture from 'gl-texture2d'
import events from 'dom-events'
import once from 'once'
const noop = () => {}

module.exports = function(gl, cb) {
  cb = cb || noop

  const video = document.createElement('video')
  video.setAttribute('loop', true)
  video.setAttribute('muted', 'muted')
  addSource('video/webm', 'assets/ballet2.webm')
  // addSource('video/mp4', 'assets/ballet2.mp4')
  video.load()

  const ready = once(() => {
    const texture = createTexture(gl, video)
    texture.minFilter = gl.LINEAR
    texture.update = update.bind(null, texture)
    texture.video = video
    console.log("Ready.")

    cb(null, texture)
    cb = noop
  })

  if (video.readyState > video.HAVE_FUTURE_DATA) 
    ready()
  
  events.on(video, 'error', err => {
    cb(new Error(err))
    cb = noop
  })
  
  // const ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
  // if (ff) {
  //   fixLoop(video)
  // }
  events.on(video, 'canplay', ready)

  function fixLoop(video) {
    // events.on(video, 'ended', () => {
    //   console.log("END")
    //   video.play()
    // })
    // events.on(video, 'timeupdate', () => {
    //   //grr.. firefox 'ended' and 'loop' not working
    //   if (Math.round(video.currentTime) >= Math.round(video.duration)) {
    //     video.src = src
    //     video.play()
    //   }
    // })
  }

  function addSource(type, path) {
    var source = document.createElement('source')
    source.src = path
    source.type = type
    return video.appendChild(source)
  }

  function update(texture) {
    if (video.readyState !== video.HAVE_ENOUGH_DATA)
      return
    texture.setPixels(video)
  }
}