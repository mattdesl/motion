module.exports = function(gl) {
  var rgb = module.exports.rgb
  gl.clearColor(rgb[0], rgb[1], rgb[2], 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

module.exports.rgb = [25/255, 50/255, 55/255]