const clear = require('./clear')
const glslify = require('glslify')
const Particles = require('gl-particles')
const random = require('gl-vec2/random')
const getPixels = require('gl-texture2d-pixels')
const triangle = require('a-big-triangle')
const createShader = require('gl-shader')

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
  let time = 0
  let motion
  particles.populate(rebirth)

  Object.defineProperty(render, 'motion', {
    get() {
      return motion
    },
    set(tex) {
      motion = tex
    }
  })

  return render

  function rebirth(u, v, data) {
    // var moving = false
    // if (pixels) {
    //   moving = true
    //   const i = u + (v * particles.shape[0])
    //   const px = pixels[i*4 + 0]/255
    //   const py = pixels[i*4 + 1]/255
    //   const vx = pixels[i*4 + 2]/255
    //   const vy = pixels[i*4 + 3]/255

    //   copy(data, px, py, vx, vy)

    //   // if (px < 0.0)
    //   //   moving = false
    //   // data[2] === 0 || data[3] === 0
    // }

    // if (!moving) {
      random(r, Math.random())
      data[0] = r[0]
      data[1] = r[1]
      // data[0] = Math.random()*2-1
      // data[1] = Math.random()*2-1
    // }
    // data[2] = 0
    // data[3] = 0
  }

  function render(dt) {
    time += dt / 1000
    const width  = gl.drawingBufferWidth
    const height = gl.drawingBufferHeight
    const resolution = [width, height]

    gl.disable(gl.BLEND)
    if (motion) 
      motion.bind(1)

    particles.step(function(uniforms) {
      uniforms.motion = 1
      uniforms.time = time
    })

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.viewport(0, 0, width, height)
    
    clear(gl)

    quadShader.bind()
    quadShader.uniforms.time = time
    quadShader.uniforms.motion = 1
    quadShader.uniforms.resolution = resolution
    triangle(gl)
    
    // repopTimer += dt
    // if (repopTimer > 3000) {
    //   repopTimer = 0
    //   gl.viewport(0, 0, particles.shape[0], particles.shape[1])
    //   pixels = getPixels(particles.curr.color[0])
    //   particles.populate(rebirth)
    //   gl.viewport(0, 0, width, height)
    // }

    particles.draw(function(uniforms) {
      uniforms.motion = 1
      uniforms.time = time
      uniforms.resolution = resolution
    })
  }

}