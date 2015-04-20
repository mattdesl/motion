import THREE from 'three'
import events from 'dom-events'
const glslify = require('glslify')

const noop = () => {}

module.exports = function(app, cb) {
  cb = cb || noop

  const video = document.createElement('video')
  video.setAttribute('loop', true)
  video.setAttribute('muted', 'muted')
  addSource('video/mp4', 'assets/motion2.mp4')
  video.load()

  const texture = new THREE.Texture(video)
  texture.minFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  const result = {
    video, texture
  }

  events.on(video, 'error', err => {
    cb(new Error(err))
    cb = noop
  })
  events.on(video, 'canplay', () => {
    texture.needsUpdate = true
    video.play()
    cb(null, result)
    cb = noop
  })

  function addSource(type, path) {
    var source = document.createElement('source')
    source.src = path
    source.type = type
    return video.appendChild(source)
  }

  app.on('tick', () => {
    if (video.readyState !== video.HAVE_ENOUGH_DATA)
      return
    texture.needsUpdate = true
  })

  const vert = glslify('./shaders/pass.vert')
  const frag = glslify('./shaders/debug.frag')

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      iChannel0: { type: 't', value: texture }
    },
    vertexShader: vert,
    fragmentShader: frag,
    defines: {
      'USE_MAP': ''
    }
  })
  const geo = new THREE.BoxGeometry(1,1,1)
  const mesh = new THREE.Mesh(geo, mat)
  app.scene.add(mesh)

  return result
}