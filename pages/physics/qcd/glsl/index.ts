import vertexTfSrc from './vertex-tf.glsl';
import vertexFbSrc from './vertex-fb.glsl';
import fragmentSrc from './fragment.glsl';
import fragmentDummySrc from './fragment-dummy.glsl';


// Типы для WebGL
type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: { [key: string]: number };
  uniformLocations: { [key: string]: WebGLUniformLocation | null };
};

// Интерфейс входных точек
interface Point {
  lat: number; // широта в радианах
  lon: number; // долгота в радианах
}

// Результат проекции
interface ProjectedPoint {
  x: number;
  y: number;
}

class MolweideProjector {
  private canvas: HTMLCanvasElement;
  private gl: WebGLContext;
  private useWebgl2: boolean;

  private programInfo: ProgramInfo | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private resultBuffer: WebGLBuffer | null = null;
  private tf: WebGLTransformFeedback | null = null;
  private texture: WebGLTexture | null = null;
  private fbo: WebGLFramebuffer | null = null;

  constructor(canvas: HTMLCanvasElement, useWebgl2 = true, size = 10) {
    this.canvas = canvas;
    this.useWebgl2 = useWebgl2;

    if (useWebgl2) {
      this.gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    } else {
      this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    }

    if (!this.gl) {
      throw new Error('WebGL не поддерживается');
    }

    this.init(size);
  }

  private init(size: number): void {
    const gl = this.gl;

    // Компилируем шейдеры
    if (this.useWebgl2) {
      this.programInfo = this.createProgram(gl, vertexTfSrc, fragmentDummySrc, [
        'a_position'
      ], ['u_R']);
    } else {
      this.programInfo = this.createProgram(gl, vertexFbSrc, fragmentSrc, [
        'a_position'
      ], ['u_R']);
      this.setupFramebuffer();
    }

    // Создаём буферы
    this.positionBuffer = gl.createBuffer();
    if (this.useWebgl2) {
      this.resultBuffer = gl.createBuffer();
      const gl2 = gl as WebGL2RenderingContext;
      gl2.bindBuffer(gl2.TRANSFORM_FEEDBACK_BUFFER, this.resultBuffer);
      gl.bufferData(
        gl2.TRANSFORM_FEEDBACK_BUFFER,
        size * 2 * 4, // points.length * компонентов (2) * байт на float (4)
        gl2.STATIC_READ
      );
      this.tf = gl.createTransformFeedback();
    }
  }

  private createProgram(
    gl: WebGLContext,
    vertSrc: string,
    fragSrc: string | null,
    attribNames: string[],
    uniformNames: string[]
  ): ProgramInfo {
    const program = gl.createProgram();
    if (!program) throw new Error('Не удалось создать программу');

    // Вершинный шейдер
    const vert = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vert, vertSrc);
    gl.compileShader(vert);
    if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vert));
      throw new Error('Ошибка компиляции вершинного шейдера');
    }
    gl.attachShader(program, vert);

    // Фрагментный шейдер (если есть)
    if (fragSrc) {
      const frag = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(frag, fragSrc);
      gl.compileShader(frag);
      if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(frag));
        throw new Error('Ошибка компиляции фрагментного шейдера');
      }
      gl.attachShader(program, frag);
    }

    console.log({ fragSrc, fragmentSrc })

    gl.linkProgram(program);
    // (gl as WebGL2RenderingContext).linkProgram()
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      throw new Error('Ошибка линковки программы');
    }

    try {
      // Явно указываем переменные для Transform Feedback
      const feedbackVaryings = ['v_result'];
      gl.transformFeedbackVaryings(
        program,
        feedbackVaryings,
        gl.INTERLEAVED_ATTRIBS // или gl.SEPARATE_ATTRIBS
      );

      // Перелинковываем программу после указания varyings!
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Transform Feedback link failed:', gl.getProgramInfoLog(program));
        throw new Error('Не удалось настроить Transform Feedback');
      }
    } catch (e) {
      console.error(e);
    }

    // Собираем локации атрибутов и униформ
    const attribLocations: { [key: string]: number } = {};
    const uniformLocations: { [key: string]: WebGLUniformLocation | null } = {};


    attribNames.forEach(name => {
      attribLocations[name] = gl.getAttribLocation(program, name);
    });

    uniformNames.forEach(name => {
      uniformLocations[name] = gl.getUniformLocation(program, name);
    });

    return { program, attribLocations, uniformLocations };
  }

  private setupFramebuffer(): void {
    const gl = this.gl as WebGLRenderingContext;
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.FLOAT,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    this.fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D
      (
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        this.texture,
        0
      );
  }

  public setInputData(points: Point[]): void {
    const gl = this.gl;
    const data = new Float32Array(points.length * 2);

    points.forEach((point, i) => {
      data[i * 2] = point.lat;
      data[i * 2 + 1] = point.lon;
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  private async computeWithTf(R: number, points: Point[]): Promise<Float32Array> {
    const gl = this.gl as WebGL2RenderingContext;
    const { program, attribLocations, uniformLocations } = this.programInfo!;

    // this.resizeResultBuffer(points.length);


    gl.useProgram(program);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tf!);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.resultBuffer!);

    const posLoc = attribLocations['a_position'];
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const rLoc = uniformLocations['u_R'];
    gl.uniform1f(rLoc, R);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, points.length);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);

    // 1. Создаём Sync Object
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)!;

    console.log({ sync });

    // 2. Ждём завершения (можно добавить timeout)
    await this.waitForSync(gl, sync);

    console.log('!', { points });

    // 3. Читаем данные
    const resultArray = new Float32Array(points.length * 2);
    gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, resultArray);

    // 4. Очищаем Sync Object
    gl.deleteSync(sync);

    return resultArray;
  }

  // Вспомогательный метод для ожидания
  private async waitForSync(
    gl: WebGL2RenderingContext,
    sync: WebGLSync,
    timeoutMs = 1000 // 5 секунд — разумный предел
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();

      const check = () => {
        const elapsed = performance.now() - startTime;

        // Проверка таймаута
        if (elapsed > timeoutMs) {
          gl.deleteSync(sync);
          resolve();
          // reject(new Error(`Transform Feedback timeout after ${timeoutMs}ms`));
          return;
        }

        // Проверяем статус синхронизации
        const status = gl.clientWaitSync(sync, 0, 0);

        if (status === gl.CONDITION_SATISFIED) {
          // GPU завершил работу
          gl.deleteSync(sync);
          resolve();
        } else if (status === gl.WAIT_FAILED) {
          // Критическая ошибка (например, контекст потерян)
          gl.deleteSync(sync);
          reject(new Error('GPU sync failed: WAIT_FAILED'));
        } else {
          // Продолжаем ждать (следующий кадр)
          requestAnimationFrame(check);
        }
      };

      check();
    });
  }



  private async computeWithFb
    (
      R: number,
      width: number,
      height: number,
      points: Point[],
    ): Promise<Float32Array> {
    const gl = this.gl as WebGLRenderingContext;
    const { program, attribLocations, uniformLocations } = this.programInfo!;

    gl.useProgram(program);

    // Связывание атрибутов
    const posLoc = attribLocations['a_position'];
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Установка uniform
    const rLoc = uniformLocations['u_R'];
    gl.uniform1f(rLoc, R);

    // Настройка фреймбуфера
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Отрисовка точек
    gl.drawArrays(gl.POINTS, 0, points.length);


    // Чтение пикселей
    const pixels = new Float32Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.FLOAT, pixels);

    // Фильтрация реальных данных (пропускаем нули)
    const results: ProjectedPoint[] = [];
    for (let i = 0; i < pixels.length; i += 4) {
      const x = pixels[i];
      const y = pixels[i + 1];
      if (x !== 0 || y !== 0) { // Предполагаем, что нули — пустые пиксели
        results.push({ x, y });
      }
    }

    return new Float32Array(results.flatMap(p => [p.x, p.y]));
  }

  public async project(
    points: Point[],
    R: number,
    width = 800,
    height = 600
  ): Promise<ProjectedPoint[]> {
    this.setInputData(points);


    let resultArray: Float32Array;

    if (this.useWebgl2) {
      resultArray = await this.computeWithTf(R, points);
    } else {
      resultArray = await this.computeWithFb(R, width, height, points);
    }

    // Преобразуем массив в массив объектов
    const projectedPoints: ProjectedPoint[] = [];
    for (let i = 0; i < resultArray.length; i += 2) {
      projectedPoints.push({
        x: resultArray[i],
        y: resultArray[i + 1]
      });
    }

    return projectedPoints;
  }
}

interface Point {
  lat: number; // широта в радианах [-π/2, π/2]
  lon: number; // долгота в радианах [-π, π]
}

/**
 * Генерирует сетку точек на сфере с фиксированным шагом по широте и долготе
 * @param latSteps - количество шагов по широте (от -90° до 90°)
 * @param lonSteps - количество шагов по долготе (от -180° до 180°)
 * @returns массив точек { lat, lon }
 */
function generateSphereGrid(latSteps: number, lonSteps: number): Point[] {
  const points: Point[] = [];

  for (let i = 0; i <= latSteps; i++) {
    // Широта: от -π/2 до π/2
    const lat = -Math.PI / 2 + (Math.PI * 2 / 2 * i) / latSteps;

    for (let j = 0; j < lonSteps; j++) {
      // Долгота: от -π до π
      const lon = -Math.PI + (2 * Math.PI * j) / lonSteps;

      points.push({ lat, lon });
    }
  }

  return points;
}

function computeBoundingBox(points: { x: number; y: number }[]): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  return { minX, maxX, minY, maxY };
}

function calculateFitParams(
  bbox: { minX: number; maxX: number; minY: number; maxY: number },
  canvasWidth: number,
  canvasHeight: number,
  margin = 40 // отступы от краёв в пикселях
): { scale: number; offsetX: number; offsetY: number } {

  const bboxWidth = bbox.maxX - bbox.minX;
  const bboxHeight = bbox.maxY - bbox.minY;

  // Доступное пространство с учётом отступов
  const availableWidth = canvasWidth - 2 * margin;
  const availableHeight = canvasHeight - 2 * margin;

  // Масштаб по ширине и высоте
  const scaleX = availableWidth / bboxWidth;
  const scaleY = availableHeight / bboxHeight;

  // Берём минимальный масштаб, чтобы всё влезло
  const scale = Math.min(scaleX, scaleY);

  // Центрируем: вычисляем смещение
  const offsetX = (canvasWidth - bboxWidth * scale) / 2;
  const offsetY = (canvasHeight - bboxHeight * scale) / 2;

  return { scale, offsetX, offsetY };
}

function drawProjectedPointsFitted(
  projectedPoints: { x: number; y: number }[],
  canvas: HTMLCanvasElement,
  radius = 3,
  color = '#0000FF',
  margin = 10 // отступы от краёв
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;

  // 1. Очищаем холст
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // 2. Вычисляем bounding box
  const bbox = computeBoundingBox(projectedPoints);

  // 3. Рассчитываем параметры масштабирования
  const { scale, offsetX, offsetY } = calculateFitParams(bbox, width, height, margin);

  ctx.fillStyle = color;

  // 4. Рисуем каждую точку с масштабированием и смещением
  for (const point of projectedPoints) {
    // Преобразуем координаты:
    // - сначала относим к началу bounding box
    // - затем масштабируем
    // - потом смещаем на экранные координаты
    const x = (point.x - bbox.minX) * scale + offsetX;
    const y = (point.y - bbox.minY) * scale + offsetY;


    // Проверяем, что точка в границах (с учётом радиуса)
    if (
      x >= radius &&
      x <= width - radius &&
      y >= radius &&
      y <= height - radius
    ) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}


/**
 * Рисует проецированные точки на canvas в виде маленьких кругов
 * @param projectedPoints - массив точек { x, y } после проекции
 * @param canvas - элемент <canvas>
 * @param radius - радиус кружка в пикселях (по умолчанию 3)
 * @param color - цвет кружка (по умолчанию '#0000FF')
 */
function drawProjectedPoints(
  projectedPoints: { x: number; y: number }[],
  canvas: HTMLCanvasElement,
  radius = 3,
  color = '#0000FF'
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Очищаем canvas и заливаем белым
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рисуем каждую точку
  ctx.fillStyle = color;
  for (const point of projectedPoints) {
    // Преобразуем нормализованные координаты [-1, 1] в пиксели
    const x = (point.x + 1) * 0.2 * canvas.width;
    const y = (1 - point.y) * 0.2 * canvas.height; // инвертируем Y (в canvas Y вниз)

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function computeDistortion(x: number, y: number): { stretchX: number; stretchY: number } {
  // x, y — нормализованные координаты проекции [-1, 1]
  // В проекции Мольвейде:
  // - по вертикали (Y) растяжение растёт к полюсам
  // - по горизонтали (X) сжатие растёт к полюсам

  const lat = Math.asin(Math.max(Math.min(y, 1), -1)); // приближённая широта

  if (Number.isNaN(lat)) {
    // console.log({y});
  }
  const cosLat = Math.cos(lat);

  const sinLat = Math.abs(Math.sin(lat));


  // Искажение по X (горизонтальное): сильнее к полюсам (sinLat)
  const stretchX = sinLat * 2; // коэффициент растяжения


  // Искажение по Y (вертикальное): сжатие к полюсам, растяжение у экватора
  const stretchY = -sinLat * 1.5; // отрицательное = сжатие


  return { stretchX, stretchY };
}

function computeMolweideDistortion(x: number, y: number): { stretchX: number; stretchY: number } {
  // x, y — нормализованные координаты проекции [-1, 1]
  // Для проекции Мольвейде:
  //   x = (2√2 / π) · λ · cos(θ)
  //   y = √2 · sin(θ)
  // где θ — параметр, связанный с широтой φ


  const R = Math.sqrt(2); // масштабный коэффициент


  // Восстанавливаем θ из y
  const theta = Math.asin(y / R);


  // cos(theta) и sin(theta)
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);


  // Частная производная по x (горизонтальное растяжение)
  // dx/dλ = (2√2 / π) · cos(theta) → масштаб по долготе
  const scaleX = (2 * R) / Math.PI * cosTheta;


  // Частная производная по y (вертикальное растяжение)
  // dy/dφ = √2 · cos(theta) · dθ/dφ
  // Для Мольвейде: dθ/dφ = cos(phi) / sqrt(2 - sin²(phi))
  const phi = theta; // в проекции Мольвейде θ ≈ φ на экваторе
  const dTheta_dPhi = Math.cos(phi) / Math.sqrt(2 - Math.pow(Math.sin(phi), 2));
  const scaleY = R * cosTheta * dTheta_dPhi;


  // Нормализуем к среднему масштабу (чтобы искажения были относительными)
  const avgScale = (scaleX + scaleY) / 2;
  const stretchX = (scaleX / avgScale) - 1; // >0 — растяжение, <0 — сжатие
  const stretchY = (scaleY / avgScale) - 1;


  return { stretchX, stretchY };
}


function drawEllipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number
) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fill();
}


function drawProjectedEllipses(
  projectedPoints: { x: number; y: number }[],
  canvas: HTMLCanvasElement,
  baseRadius = 3,        // базовый радиус эллипса (в пикселях)
  scaleFactor = 0.3,     // коэффициент растяжения по искажениям
  color = '#0000FF',
  margin = 40
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;

  // Очищаем холст
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Вычисляем bounding box и параметры масштабирования
  const bbox = computeBoundingBox(projectedPoints);
  const { scale, offsetX, offsetY } = calculateFitParams(bbox, width, height, margin);

  ctx.fillStyle = color;

  for (const point of projectedPoints) {
    // Преобразуем координаты точки
    const x = (point.x - bbox.minX) * scale + offsetX;
    const y = (point.y - bbox.minY) * scale + offsetY;

    // console.log(point);

    // Проверяем границы
    // if (x < margin || x > width - margin || y < margin || y > height - margin) continue;

    // Вычисляем искажения в точке (упрощённая модель для проекции Мольвейде)
    let stretchX = 1;
    let stretchY = 1;
    try {
      const r = computeDistortion(point.x, point.y);
      stretchX = r.stretchX;
      stretchY = r.stretchY;
    } catch (e) {
      console.error(e);
    }
    // console.log({stretchX, stretchY});
    // const totalStretch = Math.abs(stretchX) + Math.abs(stretchY);
    // ctx.fillStyle = `hsl(${totalStretch * 200}, 100%, 50%)`;


    // Размеры эллипса с учётом искажений
    const radiusX = baseRadius * (1 + stretchX * scaleFactor);
    const radiusY = baseRadius * (1 + stretchY * scaleFactor);

    // Рисуем эллипс
    drawEllipse(ctx, x, y, radiusX, radiusY);
  }
}

function generateFibonacciSpherePoints(count: number): { lat: number; lon: number }[] {
  const points: { lat: number; lon: number }[] = [];

  for (let i = 0; i < count; i++) {
    const phi = Math.PI * (1 + Math.sqrt(5)) * i / count; // золотой угол
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    const z = 1 - 2 * (i / count); // от +1 до −1
    const r = Math.sqrt(1 - z * z);

    const x = r * cosPhi;
    const y = r * sinPhi;

    // В широту/долготу
    const lat = Math.asin(y);
    const lon = Math.atan2(x, z);

    points.push({ lat, lon });
  }
  return points;
}

function generateGoldenSpiralPoints(count: number): { lat: number; lon: number }[] {
  const points: { lat: number; lon: number }[] = [];

  const goldenRatio = (1 + Math.sqrt(5)) / 2; // ≈1.618

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // от +1 до −1
    const radius = Math.sqrt(1 - y * y);

    const theta = 2 * Math.PI * goldenRatio * i;

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    // Преобразуем в широту/долготу
    const lat = Math.asin(z); // широта в радианах
    const lon = Math.atan2(x, y); // долгота в радианах

    points.push({ lat, lon });
  }

  return points;
}

function generateImprovedFibonacciPoints(count: number): { lat: number; lon: number }[] {
  const points: { lat: number; lon: number }[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈2.399963 рад (137.5°)


  for (let i = 0; i < count; i++) {
    // 1. Равномерное распределение по z (косинусу широты)
    const z = 1 - (2 * i) / (count - 1); // от +1 до −1
    const lat = Math.asin(z); // широта


    // 2. Золотой угол с сдвигом для подавления спирали
    const lon = (goldenAngle * i + Math.PI +
      0.01 * (Math.random() - 0.5)) % (2 * Math.PI); // случайный джиттер


    points.push({ lat, lon });
  }

  return points;
}

function generateIcosahedralPoints(subdivisions: number): { lat: number; lon: number }[] {
  // Базовые вершины икосаэдра (нормализованные)
  const phi = (1 + Math.sqrt(5)) / 2; // золотое сечение
  const vertices = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
  ].map(v => normalize(v));


  // Грани икосаэдра (индексы вершин)
  const faces = [
    [0, 1, 4], [0, 4, 5], [0, 5, 2], [0, 2, 6], [0, 6, 1],
    [3, 2, 7], [3, 7, 9], [3, 9, 8], [3, 8, 1], [3, 1, 2],
    [4, 11, 5], [5, 11, 2], [2, 11, 6], [6, 11, 1], [1, 11, 4],
    [7, 10, 9], [9, 10, 8], [8, 10, 1], [1, 10, 7], [7, 10, 2]
  ];


  // Подразделение граней
  const subdivided = subdivideFaces(vertices, faces, subdivisions);



  // Конвертируем в широту/долготу
  return subdivided.map(v => ({
    lat: Math.asin(v[1]),
    lon: Math.atan2(v[0], v[2])
  }));
}


// Вспомогательные функции
function normalize(v: number[]): number[] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return v.map(x => x / len);
}


function subdivideFaces(
  vertices: number[][],
  faces: number[][],
  subdivs: number
): number[][] {
  let result: number[][] = [...vertices];


  for (let s = 0; s < subdivs; s++) {
    const newPoints: number[][] = [];

    for (const face of faces) {
      const a = result[face[0]];
      const b = result[face[1]];
      const c = result[face[2]];

      // Добавляем середины рёбер
      newPoints.push(normalize(midpoint(a, b)));
      newPoints.push(normalize(midpoint(b, c)));
      newPoints.push(normalize(midpoint(c, a)));
    }

    result = [...result, ...newPoints];
    // Обновляем грани (упрощённо)
    faces = generateNewFaces(faces, result.length - newPoints.length, newPoints.length);
  }

  return result;
}

function midpoint(a: number[], b: number[]): number[] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

function generateNewFaces(oldFaces: number[][], oldCount: number, newCount: number): number[][] {
  // Упрощённая логика: возвращаемся к исходным граням
  return oldFaces; // В реальной реализации нужно пересчитывать
}

function generateRandomSpherePoints(n: number): { lat: number; lon: number }[] {
  const points: { lat: number; lon: number }[] = [];


  for (let i = 0; i < n; i++) {
    // 1. Генерируем случайную точку в 3D внутри куба [-1, 1]^3
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let z = Math.random() * 2 - 1;


    // 2. Нормализуем вектор до единичной длины (проекция на сферу)
    const length = Math.sqrt(x * x + y * y + z * z);
    if (length === 0) continue; // избегаем нулевой вектор (маловероятно, но возможно)


    x /= length;
    y /= length;
    z /= length;

    // 3. Переводим в сферические координаты (lat, lon)
    // lat — широта: от -π/2 (южный полюс) до π/2 (северный полюс)
    // lon — долгота: от -π до π
    const lat = Math.asin(z); // asin возвращает значение в [-π/2, π/2]
    const lon = Math.atan2(y, x); // atan2 возвращает значение в [-π, π]


    points.push({ lat, lon });
  }

  return points;
}


function sphericalLloydRelaxation(n: number, iterations = 2): { lat: number; lon: number }[] {
  // Начинаем с случайного распределения
  let points = generateRandomSpherePoints(n);


  for (let iter = 0; iter < iterations; iter++) {
    // Для каждой точки:
    for (let i = 0; i < n; i++) {
      // Находим «центр масс» соседей (упрощённо)
      let sumX = 0, sumY = 0, sumZ = 0;
      let count = 0;


      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        // Угловое расстояние
        const dLat = points[i].lat - points[j].lat;
        const dLon = points[i].lon - points[j].lon;
        const dist = Math.sqrt(dLat * dLat + Math.cos(points[i].lat) * Math.cos(points[j].lat) * dLon * dLon);

        if (dist < 0.5) { // Радиус поиска соседей
          const [x, y, z] = sphericalToCartesian(points[j]);
          sumX += x;
          sumY += y;
          sumZ += z;
          count++;
        }
      }

      if (count > 0) {
        // Перемещаем точку к центру соседей
        const newX = sumX / count;
        const newY = sumY / count;
        const newZ = sumZ / count;
        const len = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
        [points[i].lat, points[i].lon] = cartesianToSpherical(newX / len, newY / len, newZ / len);
      }
    }
  }

  return points;
}

// Вспомогательные функции
function sphericalToCartesian({ lat, lon }: { lat: number; lon: number }) {
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.cos(lat) * Math.sin(lon);
  const z = Math.sin(lat);
  return [x, y, z];
}

function cartesianToSpherical(x: number, y: number, z: number) {
  const lat = Math.asin(z);
  const lon = Math.atan2(y, x);
  return [lat, lon];
}

function generateFibonacciSphere(n: number): { lat: number; lon: number }[] {
  const points: { lat: number; lon: number }[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Золотой угол


  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; // от -1 до 1
    const radius = Math.sqrt(1 - y * y);


    const theta = phi * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;


    // Сферические координаты
    const lat = Math.asin(z);
    const lon = Math.atan2(x, y);
    points.push({ lat, lon });
  }

  return points;
}


function generateUniformPoints(n: number, iterations = 20): { lat: number; lon: number }[] {
  // Начальное случайное распределение
  let points = Array.from({ length: n }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1
  }));

  // Нормализуем до единичной сферы
  points = points.map(p => {
    const len = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    return { x: p.x / len, y: p.y / len, z: p.z / len };
  });

  // Итеративная оптимизация
  for (let i = 0; i < iterations; i++) {
    for (let j = 0; j < n; j++) {
      let forceX = 0, forceY = 0, forceZ = 0;
      for (let k = 0; k < n; k++) {
        if (j === k) continue;
        const dx = points[j].x - points[k].x;
        const dy = points[j].y - points[k].y;
        const dz = points[j].z - points[k].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const f = 1 / (dist * dist); // Кулоновская сила
        forceX += dx * f;
        forceY += dy * f;
        forceZ += dz * f;
      }
      // Перемещаем точку вдоль силы
      points[j].x += forceX * 0.01;
      points[j].y += forceY * 0.01;
      points[j].z += forceZ * 0.01;
      // Снова нормализуем
      const len = Math.sqrt(
        points[j].x * points[j].x +
        points[j].y * points[j].y +
        points[j].z * points[j].z
      );
      points[j].x /= len;
      points[j].y /= len;
      points[j].z /= len;
    }
  }

  // Переводим в сферические координаты
  return points.map(p => ({
    lat: Math.asin(p.z),
    lon: Math.atan2(p.y, p.x)
  }));
}


// Пример использования
(async () => {
  const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
  const { SavedMap } = await import('./saved-map');
  try {

    // Создаём проектор (по умолчанию WebGL 2.0)


    // Пример входных данных: массив точек в радианах
    // const inputPoints: Point[] = generateSphereGrid(10, 10);
    const inputPoints: Point[] = [];
    // inputPoints.push(...generateSphereGrid(100, 100));
    // inputPoints.push(...generateGoldenSpiralPoints(10000));
    // inputPoints.push(...generateImprovedFibonacciPoints(10000));
    // inputPoints.push(...generateFibonacciSphere(10000));
    // inputPoints.push(...sphericalLloydRelaxation(100));
    // inputPoints.push(...generateUniformPoints(20000));
    inputPoints.push(...Object.keys(SavedMap).map(key => key.split('/').map(s => +s)).map((c) => ({ lat: c[0], lon: c[1] })));

    //   { lat: Math.PI / 4, lon: Math.PI / 3 },   // точка 1
    //   { lat: -Math.PI / 6, lon: Math.PI / 4 }, // точка 2
    //   { lat: 0, lon: -Math.PI / 2 }           // точка 3
    // ];

    const projector = new MolweideProjector(canvas, true, inputPoints.length);

    const projected = await projector.project(inputPoints, 1.0);
    // console.log('Результаты проекции:', projected);

    const result: Record<string, [number, number]> = {};
    for (let i = 0; i < inputPoints.length; i++) {
      const point = inputPoints[i];
      const projection = projected[i];
      result[`${point.lat}/${point.lon}`] = [projection.x, projection.y];
    }
    console.log(result);

    // 4. Рисуем на canvas
    drawProjectedPointsFitted(projected, document.getElementById('expCanvas') as HTMLCanvasElement, 1, '#FF0000');
    // drawProjectedEllipses(projected, document.getElementById('expCanvas2') as HTMLCanvasElement, 1, 0.3, '#FF0000');

    // results содержит объекты { x, y }
  } catch (error) {
    console.error('Ошибка проекции:', error);
  }
})();
