// Вычисляет проекцию Мольвейде для (широта, долгота)
vec2 computeMolweide(float lat, float lon, float u_R) {
  float target = 3.14159265359 * sin(lat);
  float theta = lat;
  
  // 3 итерации метода Ньютона (достаточно для визуальной точности)
  for (int i = 0; i < 3; i++) {
    float f = 2.0 * theta + sin(2.0 * theta) - target;
    float df = 2.0 + 2.0 * cos(2.0 * theta);
    theta -= f / df;
  }
  
  float deltaLon = mod(lon + 3.14159265359, 6.28318530718) - 3.14159265359;
  float x = u_R * (2.0 * 1.41421356237 / 3.14159265359) * deltaLon * cos(theta);
  float y = u_R * 1.41421356237 * sin(theta);
  
  return vec2(x, y);
}

// Нормализует долготу к [-π, π]
float normalizeLon(float lon) {
  return mod(lon + 3.14159265359, 6.28318530718) - 3.14159265359;
}
