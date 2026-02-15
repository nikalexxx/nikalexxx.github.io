// vertex-fb.glsl (WebGL 1.0, Framebuffer)
attribute vec2 a_position;
uniform float u_R;
varying vec2 v_uv;

#include common.glsl


void main() {
  float lat = a_position.x;
  float lon = a_position.y;
  vec2 projected = computeMolweide(lat, lon, u_R);
  gl_Position = vec4(projected, 0.0, 1.0);
  v_uv = projected;
}
