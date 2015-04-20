import fitter from 'canvas-fit'
import createContext from 'webgl-context'
import createLoop from 'raf-loop'
import createEngine from './src/engine'
import createVideo from './src/video'
import createImage from './src/image'
import assign from 'object-assign'

const gl = createContext({
  alpha: false, antialias: false
})
const canvas = gl.canvas
// const dpr = Math.min(1.0, window.devicePixelRatio)
const fit = fitter(canvas, () => {
  return [ window.innerWidth, window.innerHeight ]
    .map(x => Math.min(x, 500))
}, 0.8)
const engine = createEngine(gl)

require('domready')(() => {
  const resize = () => {
    fit()
    
    assign(canvas.style, {
      margin: 'auto',
      top: '0', 
      left: '0',
      bottom: '0', 
      right: '0',
      position: 'absolute'
    })
  }
  window.addEventListener('resize', resize, false)
  resize()

  assign(document.body.style, {
    background: '#193237',
    margin: '0'
  })
  document.body.appendChild(canvas)
  const loop = createLoop(draw)

  createVideo(gl, (err, texture) => {
    if (err)
      throw err
    engine.motion = texture
    loop.on('tick', texture.update.bind(texture))
    console.log("Playing")

    if (texture.video) {
      // const video = texture.video
      // document.body.appendChild(video)
      // video.style.width = '320px'
      // video.style.height = 'auto'
      // video.style.position = 'fixed'
      // video.style.top = '0'
      // video.style.left = '0'
      // video.style.zIndex = 100
    }
    loop.start()
  })

})

function draw(dt) {
  const width = gl.drawingBufferWidth
  const height = gl.drawingBufferHeight
  gl.viewport(0, 0, width, height)

  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.disable(gl.BLEND)

  // gl.clearColor(1, 1, 1, 1)
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
  engine(dt)
}