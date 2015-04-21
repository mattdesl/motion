import fitter from 'canvas-fit'
import createContext from 'webgl-context'
import createLoop from 'raf-loop'
import createEngine from './src/engine'
import createVideo from './src/video'
import createImage from './src/image'
import createAudio from './src/audio'
import renderIntro from './src/intro'

import assign from 'object-assign'
import colorStyle from 'color-style'
import parallel from 'run-parallel'

const Promise = global.Promise || require('es6-promise').Promise
const promisify = require('es6-denodeify')(Promise)

const clear = require('./src/clear')
const background = clear.rgb.map(x => x*255)

const gl = createContext({
  alpha: false, antialias: false
})
const canvas = gl.canvas

const fit = fitter(canvas, () => {
  return [ window.innerWidth, window.innerHeight ]
    .map(x => Math.min(x, 500))
}, 1)

const engine = createEngine(gl)
const resolution = [ 1, 1 ]
const deviceResolution = [ 1, 1 ]

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

    const scale = fit.scale
    deviceResolution[0] = gl.drawingBufferWidth
    deviceResolution[1] = gl.drawingBufferHeight
    resolution[0] = deviceResolution[0] / scale
    resolution[1] = deviceResolution[1] / scale
    engine.resolution = resolution
  }
  window.addEventListener('resize', resize, false)
  resize()

  assign(document.body.style, {
    background: colorStyle(background),
    margin: '0'
  })
  document.body.appendChild(canvas)
  const loop = createLoop(draw)
  clear(gl)

  Promise.all([
    promisify(createAudio)(),
    promisify(createVideo.bind(null, gl))()
  ]).then(([audio, texture]) => {
    engine.motion = texture
    console.log("Playing")

    audio.play()
    renderIntro()
    setTimeout(function() {
      texture.video.play()
    }, 2000)

    loop.on('tick', texture.update.bind(texture))
    loop.start()
  })
})


function draw(dt) {
  

  gl.viewport(0, 0, deviceResolution[0], deviceResolution[1])

  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.disable(gl.BLEND)

  // gl.clearColor(1, 1, 1, 1)
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  engine(dt)
}