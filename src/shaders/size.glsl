float size(vec2 velocity) {
  float d = length(velocity)*1000.0;
  return smoothstep(0.5, 2.0, d);
}

#pragma glslify: export(size)