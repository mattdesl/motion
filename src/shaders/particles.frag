precision mediump float;
uniform float time;
uniform sampler2D motion;
varying float vSize;

#pragma glslify: hsl2rgb = require('glsl-hsl2rgb')

void main() {
  vec2  p = (gl_PointCoord.xy - 0.5) * 2.0;

  float d = 1.0 - length(p);
  d = smoothstep(0.6, 0.8, d);

  float tmin = 0.0;
  float tmax = 0.6;
  float hue = mix(tmin, tmax, vSize) + sin(time);
  vec3 rgb = hsl2rgb(hue*0.3 + 0.0, 1.0, mix(0.0, 0.45, vSize));

  gl_FragColor = vec4(d * vec3(rgb), 1.0);
  // gl_FragColor = vec4(texture2D(motion, p).rgb, 1.0);
}