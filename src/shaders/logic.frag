precision mediump float;

#define PI 3.14159265359
#define MAX_DISPLACE 2048.0

uniform sampler2D data;
uniform sampler2D motion;
uniform float time;
uniform vec2 resolution;
uniform vec2 motionResolution;
uniform vec2 mouse;

#pragma glslify: size = require('./size')
#pragma glslify: random = require('glsl-random')
#pragma glslify: mouseEffect = require('./mouse')

float insideBox(vec2 v, vec2 bottomLeft, vec2 topRight) {
  vec2 s = step(bottomLeft, v) - step(topRight, v);
  return s.x * s.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / motionResolution;

  vec4 tData = texture2D(data, uv);

  //get RG in bytes
  vec2 position = tData.xy;
  vec2 uv2 = clamp(position * 0.5 + 0.5, 0.0, 1.0);
  uv2.y = 1.0 - uv2.y;

  vec2 velocity = tData.zw;
  vec2 motion_rg = texture2D(motion, uv2).rg;
  motion_rg.xy = 1.0 - motion_rg.xy;
  vec2 movement = vec2(motion_rg) * 2.0 - 1.0;


  // float inside = insideBox(position, vec2(-1.0), vec2(1.0));

  float dist = length((position*0.5+0.5) - 0.5);
  float r = random(uv);
  if (dist < 0.5) {
    velocity += movement.xy * 0.0005;
  } else { //re-birth the particles
    // float r = 1.0;
    float rd = smoothstep(0.5, 0.49, length(uv - 0.5));
    vec2 page = (uv * 2.0 - 1.0) * rd;
    position.xy = vec2(page * r);
    velocity.xy = vec2(0.0);
  }


  

  position += velocity;

  // velocity.x -= dir.x*0.0001*mouseOff;
  vec2 effect = mouseEffect(position, mouse, resolution);
  velocity += 0.0008*effect;
  // velocity.y -= 0.0008 * mouseOff;


  //how much to affect gravity
  // float gAffect = smoothstep(0.4, 0.91, abs(movement.x));
  // velocity -= vec2(mouseOff) * gAffect;
  velocity *= 0.99;
  // if (position.y < -1.0) {
    // position.y = 1.0;
    // velocity *= 0.0;
    // velocity.y = -velocity.y*1.0;
  // } 

  // vec2 dir = normalize(position.xy);
  // velocity.xy -= dir.xy*0.0001;

  gl_FragColor = vec4(position, velocity);
}