// fragment.glsl (общий для WebGL 1.0)
precision mediump float;
varying vec2 v_uv;

void main() {
  // Сохраняем (x, y) в RGBA (x → R, y → G, остальное 0)
  gl_FragColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);
}
