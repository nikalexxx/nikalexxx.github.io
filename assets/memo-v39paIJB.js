function c(r){const e=new Map;return(...t)=>{const n=t.join();if(e.has(n))return e.get(n);const o=r(...t);return e.set(n,o),o}}export{c as m};
