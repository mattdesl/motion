import createTexture from 'gl-texture2d'
import events from 'dom-events'
const noop = () => {}

module.exports = function(gl, cb) {
  cb = cb || noop

  const video = document.createElement('video')
  video.setAttribute('loop', true)
  video.setAttribute('muted', 'muted')
  addSource('video/mp4', 'assets/ballet2.mp4')

  const ready = () => {
    console.log(video.width, video.height)
    const texture = createTexture(gl, video)
    texture.minFilter = gl.LINEAR
    texture.update = update.bind(null, texture)
    texture.video = video
    cb(null, texture)
    cb = noop
  }

  if (video.readyState > video.HAVE_FUTURE_DATA) 
    ready()
  
  events.on(video, 'error', err => {
    cb(new Error(err))
    cb = noop
  })
  events.on(video, 'canplay', ready)

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