vec2 mouseEffect(vec2 position, vec2 mouse, vec2 resolution) {
  vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
  vec2 mpos = position * aspect;
  vec2 dir = normalize(mpos - mouse);
  float mouseOff = distance(mpos, mouse);
  mouseOff = smoothstep(0.05, 0.0, mouseOff);
  return dir*mouseOff;
}

#pragma glslify: export(mouseEffect)