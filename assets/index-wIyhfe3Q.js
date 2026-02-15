import{a as F}from"./index-ByZj_pOb.js";var R=`#version 300 es
#pragma transform_feedback_varyings v_result
#pragma transform_feedback_buffer_mode separate
vec2 computeMolweide(float lat, float lon, float u_R) {
  float target = 3.14159265359 * sin(lat);
  float theta = lat;
  
  
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

float normalizeLon(float lon) {
  return mod(lon + 3.14159265359, 6.28318530718) - 3.14159265359;
}

in vec2 a_position;  
uniform float u_R;    
out vec2 v_result;   

void main() {
  float lat = a_position.x;
  float lon = a_position.y;
  v_result = computeMolweide(lat, lon, u_R);
  gl_Position = vec4(v_result, 0.0, 1.0);
}`,T=`attribute vec2 a_position;
uniform float u_R;
varying vec2 v_uv;

vec2 computeMolweide(float lat, float lon, float u_R) {
  float target = 3.14159265359 * sin(lat);
  float theta = lat;
  
  
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

float normalizeLon(float lon) {
  return mod(lon + 3.14159265359, 6.28318530718) - 3.14159265359;
}

void main() {
  float lat = a_position.x;
  float lon = a_position.y;
  vec2 projected = computeMolweide(lat, lon, u_R);
  gl_Position = vec4(projected, 0.0, 1.0);
  v_uv = projected;
}`,E=`precision mediump float;
varying vec2 v_uv;

void main() {
  
  gl_FragColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);
}`,p=`#version 300 es

void main() {
  
}`;class A{constructor(t,e=!0,o=10){if(this.programInfo=null,this.positionBuffer=null,this.resultBuffer=null,this.tf=null,this.texture=null,this.fbo=null,this.canvas=t,this.useWebgl2=e,e?this.gl=t.getContext("webgl2"):this.gl=t.getContext("webgl")||t.getContext("experimental-webgl"),!this.gl)throw new Error("WebGL не поддерживается");this.init(o)}init(t){const e=this.gl;if(this.useWebgl2?this.programInfo=this.createProgram(e,R,p,["a_position"],["u_R"]):(this.programInfo=this.createProgram(e,T,E,["a_position"],["u_R"]),this.setupFramebuffer()),this.positionBuffer=e.createBuffer(),this.useWebgl2){this.resultBuffer=e.createBuffer();const o=e;o.bindBuffer(o.TRANSFORM_FEEDBACK_BUFFER,this.resultBuffer),e.bufferData(o.TRANSFORM_FEEDBACK_BUFFER,t*2*4,o.STATIC_READ),this.tf=e.createTransformFeedback()}}createProgram(t,e,o,s,n){const r=t.createProgram();if(!r)throw new Error("Не удалось создать программу");const a=t.createShader(t.VERTEX_SHADER);if(t.shaderSource(a,e),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS))throw console.error(t.getShaderInfoLog(a)),new Error("Ошибка компиляции вершинного шейдера");if(t.attachShader(r,a),o){const i=t.createShader(t.FRAGMENT_SHADER);if(t.shaderSource(i,o),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS))throw console.error(t.getShaderInfoLog(i)),new Error("Ошибка компиляции фрагментного шейдера");t.attachShader(r,i)}if(console.log({fragSrc:o,fragmentSrc:E}),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw console.error(t.getProgramInfoLog(r)),new Error("Ошибка линковки программы");try{const i=["v_result"];if(t.transformFeedbackVaryings(r,i,t.INTERLEAVED_ATTRIBS),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw console.error("Transform Feedback link failed:",t.getProgramInfoLog(r)),new Error("Не удалось настроить Transform Feedback")}catch(i){console.error(i)}const c={},f={};return s.forEach(i=>{c[i]=t.getAttribLocation(r,i)}),n.forEach(i=>{f[i]=t.getUniformLocation(r,i)}),{program:r,attribLocations:c,uniformLocations:f}}setupFramebuffer(){const t=this.gl,e=this.canvas.width,o=this.canvas.height;this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,o,0,t.RGBA,t.FLOAT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),this.fbo=t.createFramebuffer(),t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.texture,0)}setInputData(t){const e=this.gl,o=new Float32Array(t.length*2);t.forEach((s,n)=>{o[n*2]=s.lat,o[n*2+1]=s.lon}),e.bindBuffer(e.ARRAY_BUFFER,this.positionBuffer),e.bufferData(e.ARRAY_BUFFER,o,e.STATIC_DRAW)}async computeWithTf(t,e){const o=this.gl,{program:s,attribLocations:n,uniformLocations:r}=this.programInfo;o.useProgram(s),o.bindTransformFeedback(o.TRANSFORM_FEEDBACK,this.tf),o.bindBufferBase(o.TRANSFORM_FEEDBACK_BUFFER,0,this.resultBuffer);const a=n.a_position;o.enableVertexAttribArray(a),o.vertexAttribPointer(a,2,o.FLOAT,!1,0,0);const c=r.u_R;o.uniform1f(c,t),o.enable(o.RASTERIZER_DISCARD),o.beginTransformFeedback(o.POINTS),o.drawArrays(o.POINTS,0,e.length),o.endTransformFeedback(),o.disable(o.RASTERIZER_DISCARD);const f=o.fenceSync(o.SYNC_GPU_COMMANDS_COMPLETE,0);console.log({sync:f}),await this.waitForSync(o,f),console.log("!",{points:e});const i=new Float32Array(e.length*2);return o.getBufferSubData(o.TRANSFORM_FEEDBACK_BUFFER,0,i),o.deleteSync(f),i}async waitForSync(t,e,o=1e3){return new Promise((s,n)=>{const r=performance.now(),a=()=>{if(performance.now()-r>o){t.deleteSync(e),s();return}const f=t.clientWaitSync(e,0,0);f===t.CONDITION_SATISFIED?(t.deleteSync(e),s()):f===t.WAIT_FAILED?(t.deleteSync(e),n(new Error("GPU sync failed: WAIT_FAILED"))):requestAnimationFrame(a)};a()})}async computeWithFb(t,e,o,s){const n=this.gl,{program:r,attribLocations:a,uniformLocations:c}=this.programInfo;n.useProgram(r);const f=a.a_position;n.enableVertexAttribArray(f),n.vertexAttribPointer(f,2,n.FLOAT,!1,0,0);const i=c.u_R;n.uniform1f(i,t),n.bindFramebuffer(n.FRAMEBUFFER,this.fbo),n.viewport(0,0,e,o),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.POINTS,0,s.length);const h=new Float32Array(e*o*4);n.readPixels(0,0,e,o,n.RGBA,n.FLOAT,h);const m=[];for(let u=0;u<h.length;u+=4){const _=h[u],d=h[u+1];(_!==0||d!==0)&&m.push({x:_,y:d})}return new Float32Array(m.flatMap(u=>[u.x,u.y]))}async project(t,e,o=800,s=600){this.setInputData(t);let n;this.useWebgl2?n=await this.computeWithTf(e,t):n=await this.computeWithFb(e,o,s,t);const r=[];for(let a=0;a<n.length;a+=2)r.push({x:n[a],y:n[a+1]});return r}}function g(l){let t=1/0,e=-1/0,o=1/0,s=-1/0;for(const n of l)n.x<t&&(t=n.x),n.x>e&&(e=n.x),n.y<o&&(o=n.y),n.y>s&&(s=n.y);return{minX:t,maxX:e,minY:o,maxY:s}}function b(l,t,e,o=40){const s=l.maxX-l.minX,n=l.maxY-l.minY,r=t-2*o,a=e-2*o,c=r/s,f=a/n,i=Math.min(c,f),h=(t-s*i)/2,m=(e-n*i)/2;return{scale:i,offsetX:h,offsetY:m}}function y(l,t,e=3,o="#0000FF",s=10){const n=t.getContext("2d");if(!n)return;const{width:r,height:a}=t;n.clearRect(0,0,r,a),n.fillStyle="#FFFFFF",n.fillRect(0,0,r,a);const c=g(l),{scale:f,offsetX:i,offsetY:h}=b(c,r,a,s);n.fillStyle=o;for(const m of l){const u=(m.x-c.minX)*f+i,_=(m.y-c.minY)*f+h;u>=e&&u<=r-e&&_>=e&&_<=a-e&&(n.beginPath(),n.arc(u,_,e,0,2*Math.PI),n.fill())}}(async()=>{const l=document.getElementById("glCanvas"),{SavedMap:t}=await F(async()=>{const{SavedMap:e}=await import("./saved-map-B78UwLCu.js");return{SavedMap:e}},[]);try{const e=[];e.push(...Object.keys(t).map(r=>r.split("/").map(a=>+a)).map(r=>({lat:r[0],lon:r[1]})));const s=await new A(l,!0,e.length).project(e,1),n={};for(let r=0;r<e.length;r++){const a=e[r],c=s[r];n[`${a.lat}/${a.lon}`]=[c.x,c.y]}console.log(n),y(s,document.getElementById("expCanvas"),1,"#FF0000")}catch(e){console.error("Ошибка проекции:",e)}})();
