varying vec2 vUv;
uniform sampler2D iChannel0;
// uniform float iGlobalTime;
// uniform vec2 iResolution;

void main() {

  gl_FragColor.rgb = texture2D(iChannel0, vUv).rrr;
  gl_FragColor.a = 1.0;
}