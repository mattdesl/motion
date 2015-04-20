import loadImage from 'img'
import createTexture from 'gl-texture2d'
const noop = () => {}

export default function(gl, cb) {
  cb = cb || noop

  loadImage('assets/test.png', (err, img) => {
    if (err) return cb(err)
    const texture = createTexture(gl, img)
    texture.minFilter = gl.LINEAR
    texture.update = noop
    cb(null, texture)
  })
}