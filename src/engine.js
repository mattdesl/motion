const clear = require('./clear')
const glslify = require('glslify')
const Particles = require('gl-particles')
const random = require('gl-vec2/random')
const getPixels = require('gl-texture2d-pixels')
const triangle = require('a-big-triangle')
const createShader = require('gl-shader')
const mouse = require('touch-position')()

const logic = glslify('./shaders/logic.frag')
const pointVert = glslify('./shaders/particles.vert')
const pointFrag = glslify('./shaders/particles.frag')
const quadVert = glslify('./shaders/quad.vert')
const quadFrag = glslify('./shaders/quad.frag')

function copy(out, x, y, z, w) {
  out[0] = x
  out[1] = y
  out[2] = z
  out[3] = w
  return out
}

export default function(gl) {
  const quadShader = createShader(gl, quadVert, quadFrag)

  const particles = Particles(gl, {
    shape: [500, 500],
    logic: logic,
    vert: pointVert,
    frag: pointFrag
  })

  const r = [0, 0]
  const mouseVec = [0, 0]
  let time = 0
  let motion
  let resolution
  particles.populate(repopulate)

  Object.defineProperties(render, {
    motion: {
      get() {
        return motion
      },
      set(tex) {
        motion = tex
      }
    },
    resolution: {
      get() {
        return resolution
      },
      set(res) {
        resolution = res
      }
    }
  })

  return render

  function repopulate(u, v, data) {
    random(r, Math.random())
    data[0] = r[0]
    data[1] = r[1]
  }

  function render(dt) {
    time += dt / 1000
    const width  = gl.drawingBufferWidth
    const height = gl.drawingBufferHeight
    const deviceResolution = [width, height]

    gl.disable(gl.BLEND)
    if (motion) 
      motion.bind(1)

  
    const midx = window.innerWidth/2
    const midy = window.innerHeight/2
    mouseVec[0] = ((mouse[0] - midx) / (resolution[0]/2))
    mouseVec[1] = ((mouse[1] - midy) / (-resolution[1]/2))

    // mouseVec[0] = (((mouse[0] + window.innerWidth/2) / resolution[0]) * 2 - 1)
    // mouseVec[0] += (deviceResolution[0]/deviceResolution[1])
    // mouseVec[1] = (mouse[1] / window.innerHeight) * -2 + 1
    // mouseVec[0] *=

  // uv.x -= aspect/2.0 - 0.5;
    // mouseVec[1] *= 2

    particles.step(function(uniforms) {
      uniforms.motion = 1
      uniforms.mouse = mouseVec
      uniforms.motionResolution = particles.shape
      uniforms.resolution = deviceResolution
      uniforms.time = time
    })

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.viewport(0, 0, width, height)
    
    clear(gl)

    quadShader.bind()
    quadShader.uniforms.time = time
    quadShader.uniforms.motion = 1
    quadShader.uniforms.resolution = deviceResolution
    triangle(gl)
    
    particles.draw(function(uniforms) {
      uniforms.mouse = mouseVec
      uniforms.motion = 1
      uniforms.time = time
      uniforms.resolution = deviceResolution
    })
  }

}