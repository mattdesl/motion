precision mediump float;
uniform sampler2D data;
uniform vec2 resolution;
attribute vec2 uv;
varying float vSize;

#pragma glslify: size = require('./size')

void main() {
  vec4 tData = texture2D(data, uv);
  vec2 position = tData.xy;
  float dist = length((position*0.5+0.5) - 0.5);
  dist = smoothstep(0.5, 0.0, dist);

  position.x *= resolution.y / resolution.x;
  float motion = size(vec2(tData.z, tData.w*0.5));
  
  float pSize = dist * motion;
  
  gl_PointSize = pSize * 3.0;
  gl_Position = vec4(position, 1, 1);
  vSize = pSize;
}