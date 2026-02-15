// vertex-tf.glsl (WebGL 2.0, Transform Feedback)
#version 300 es
#pragma transform_feedback_varyings v_result
#pragma transform_feedback_buffer_mode separate
#include common.glsl


in vec2 a_position;  // (широта, долгота) в радианах
uniform float u_R;    // радиус сферы
out vec2 v_result;   // результат проекции (x, y)


void main() {
  float lat = a_position.x;
  float lon = a_position.y;
  v_result = computeMolweide(lat, lon, u_R);
  gl_Position = vec4(v_result, 0.0, 1.0);
}
