precision mediump float;

uniform vec2 resolution;
uniform sampler2D motion;
varying vec2 screenPosition;

vec3 sample(vec2 uv);
#pragma glslify: blur = require('glsl-hash-blur', iterations=5, sample=sample)
vec3 sample(vec2 uv) {
  return texture2D(motion, uv).bbb;
}

void main() {
  vec2 uv = (gl_FragCoord.xy / resolution.xy);
  uv.y = 1.0 - uv.y;
  float aspect = resolution.x/resolution.y;
  uv.x *= aspect;
  uv.x -= aspect/2.0 - 0.5;

  // float gray = texture2D(motion, uv).b;
  float texel = 1.0 / resolution.x;
  float gray = blur(uv, texel * 7.0, aspect).r;
  float vignette = length(uv - 0.5);

  gray = smoothstep(0.01, 0.82, gray) * 1.0;
  gray *= smoothstep(0.5, 0.0, vignette);
  gl_FragColor = vec4(vec3(gray), 1.0);
}