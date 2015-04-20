precision mediump float;
uniform sampler2D motion;

void main() {
  vec2  p = (gl_PointCoord.xy - 0.5) * 2.0;

  float d = 1.0 - length(p);
  d = smoothstep(0.4, 0.8, d);
  gl_FragColor = vec4(d * vec3(0.1), 1.0);
  // gl_FragColor = vec4(texture2D(motion, p).rgb, 1.0);
}