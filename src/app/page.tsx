"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Notchster — teaser for a live-visuals instrument for musicians & DJs.
// A GPU particle field flowing through a curl-noise velocity field, driven by
// sound: it breathes on the beat and flares toward white on loud passages.
// Runs on a synthesized beat by default; tap the button to drive it with the
// microphone. Three.js + GLSL.
// ---------------------------------------------------------------------------

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMouseForce;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uLevel;   // overall loudness 0..1
  uniform float uBass;    // low-end energy 0..1

  attribute float aScale;
  attribute vec3  aSeed;

  varying float vGlow;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 snoiseVec3(vec3 x){
    return vec3(
      snoise(x),
      snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
      snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
    );
  }

  vec3 curlNoise(vec3 p){
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    vec3 p_x0 = snoiseVec3(p - dx); vec3 p_x1 = snoiseVec3(p + dx);
    vec3 p_y0 = snoiseVec3(p - dy); vec3 p_y1 = snoiseVec3(p + dy);
    vec3 p_z0 = snoiseVec3(p - dz); vec3 p_z1 = snoiseVec3(p + dz);
    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    return normalize(vec3(x, y, z) / (2.0 * e));
  }

  void main(){
    vec3 pos = position;
    // uTime is a bounded flow clock (advanced per frame), not raw elapsed seconds
    float t = uTime;

    vec3 flow = curlNoise(pos * 0.16 + vec3(0.0, 0.0, t));
    float amp = 1.1 + aSeed.x * 0.9;
    pos += flow * amp;

    pos.x += sin(t * 1.7 + aSeed.y * 6.2831) * 0.25;
    pos.y += cos(t * 1.3 + aSeed.z * 6.2831) * 0.25;

    // beat pulse: the whole field expands radially on the bass
    vec3 radial = normalize(position + 0.0001);
    pos += radial * uBass * (6.0 + aScale * 4.0);

    // cursor repulsion
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse);
    float influence = uMouseForce * exp(-d * d * 0.03);
    pos.xy += normalize(toMouse + 0.0001) * influence;

    // resting in green; energy (loudness + bass + cursor) pushes toward white
    float ambient = (flow.y * 0.5 + 0.5) * 0.35;
    vGlow = clamp(ambient + uLevel * 0.85 + uBass * 0.4 + influence * 0.12, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float pulse = 1.0 + uLevel * 1.3 + uBass * 0.6;
    gl_PointSize = min(uSize * aScale * pulse * uPixelRatio * (1.0 / -mv.z), 80.0 * uPixelRatio);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColorLow;
  uniform vec3 uColorMid;
  uniform vec3 uColorHigh;

  varying float vGlow;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, r);
    alpha = pow(alpha, 1.5);

    vec3 col = mix(uColorLow, uColorMid, smoothstep(0.0, 0.6, vGlow));
    col = mix(col, uColorHigh, smoothstep(0.6, 1.0, vGlow));

    gl_FragColor = vec4(col, alpha * 0.9);
  }
`;

export default function Notchster() {
  const mountRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqRef = useRef<Uint8Array | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [micState, setMicState] = useState<"off" | "on" | "error">("off");

  // expose latest mic-state to the render loop without re-running the effect
  const micOnRef = useRef(false);
  micOnRef.current = micState === "on";

  // release the mic + tear down the audio graph (back to the synth beat)
  const stopMic = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (ctxRef.current) {
      void ctxRef.current.close();
      ctxRef.current = null;
    }
    analyserRef.current = null;
    freqRef.current = null;
  };

  const toggleMic = async () => {
    if (micState === "on") {
      stopMic();
      setMicState("off");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      streamRef.current = stream;
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      freqRef.current = new Uint8Array(analyser.frequencyBinCount);
      setMicState("on");
    } catch {
      setMicState("error");
    }
  };

  // make sure the mic is released if the page unmounts while listening
  useEffect(() => stopMic, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x07080b, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080b, 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    camera.position.set(0, 0, 24);

    const COUNT = 90000;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT * 3);

    const RX = 54;
    const RY = 38;
    const RZ = 48;
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() * 2 - 1) * RX;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * RY;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * RZ;
      scales[i] = 0.4 + Math.random() * Math.random() * 2.2;
      seeds[i * 3 + 0] = Math.random();
      seeds[i * 3 + 1] = Math.random();
      seeds[i * 3 + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(9999, 9999) },
      uMouseForce: { value: 0 },
      uSize: { value: 26 * pixelRatio },
      uPixelRatio: { value: pixelRatio },
      uLevel: { value: 0 },
      uBass: { value: 0 },
      uColorLow: { value: new THREE.Color(0x7bdd2a) },
      uColorMid: { value: new THREE.Color(0xc8ff3d) },
      uColorHigh: { value: new THREE.Color(0xfff6e6) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- pointer tracking ---
    const targetMouse = new THREE.Vector2(9999, 9999);
    const smoothMouse = new THREE.Vector2(9999, 9999);
    let targetForce = 0;
    let active = false;
    let lastCX = 0;
    let lastCY = 0;
    let lastCT = 0;

    const planeDist = camera.position.z;
    const vHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * planeDist;

    const updatePointer = (clientX: number, clientY: number) => {
      const ndcX = (clientX / window.innerWidth) * 2 - 1;
      const ndcY = -((clientY / window.innerHeight) * 2 - 1);
      const vWidth = vHeight * camera.aspect;
      targetMouse.set((ndcX * vWidth) / 2, (ndcY * vHeight) / 2);
      const now = performance.now();
      if (lastCT) {
        const dtp = (now - lastCT) / 1000;
        if (dtp > 0) {
          const px = Math.hypot(clientX - lastCX, clientY - lastCY) / dtp;
          targetForce = Math.min(16, px * 0.007);
        }
      }
      lastCX = clientX;
      lastCY = clientY;
      lastCT = now;
      active = true;
    };
    const onMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onLeave = () => {
      active = false;
      lastCT = 0;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // --- audio: smoothed level + bass, from mic or a synthesized beat ---
    let smoothLevel = 0;
    let smoothBass = 0;
    let beatPhase = 0; // separate clock for the synth groove (never uses wall elapsedTime)

    const sampleAudio = (dt: number) => {
      let level = 0;
      let bass = 0;
      const analyser = analyserRef.current;
      const data = freqRef.current;
      if (micOnRef.current && analyser && data) {
        analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
        const n = data.length;
        let bSum = 0;
        const bassBins = Math.max(1, Math.floor(n * 0.06));
        for (let i = 0; i < bassBins; i++) bSum += data[i];
        bass = bSum / bassBins / 255;
        let sum = 0;
        for (let i = 0; i < n; i++) sum += data[i];
        level = sum / n / 255;
        level = Math.min(1, level * 1.8);
        bass = Math.min(1, bass * 1.4);
      } else {
        // synthesized groove (~112 BPM): a decaying kick + a softer off-beat
        beatPhase = (beatPhase + dt * (112 / 60)) % 1;
        const kick = Math.exp(-beatPhase * 6.0);
        const off = Math.exp(-(((beatPhase + 0.5) % 1) * 8.0)) * 0.5;
        bass = Math.min(1, kick + off * 0.4);
        // synth is already smooth — use it directly so level can't ratchet upward
        level = 0.16 + 0.45 * kick + 0.12 * (0.5 + 0.5 * Math.sin(beatPhase * 6.2831 * 2));
      }
      // attack fast, release slow for mic input only
      if (micOnRef.current) {
        const upL = 1 - Math.pow(0.0001, dt);
        const dnL = 1 - Math.pow(0.2, dt);
        smoothLevel += (level - smoothLevel) * (level > smoothLevel ? upL : dnL);
        smoothBass +=
          (bass - smoothBass) *
          (bass > smoothBass ? 1 - Math.pow(0.00001, dt) : 1 - Math.pow(0.12, dt));
      } else {
        smoothLevel = level;
        smoothBass = bass;
      }
      return {
        level: Math.min(1, Math.max(0, smoothLevel)),
        bass: Math.min(1, Math.max(0, smoothBass)),
      };
    };

    const clock = new THREE.Clock();
    let flowTime = 0; // bounded animation clock (advanced per frame, not wall time)
    let spinY = 0;
    let spinX = 0;
    let ambientT = 0;
    let raf = 0;
    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      ambientT += dt;

      const { level, bass } = sampleAudio(dt);
      // flow speed scales with energy but stays capped — never multiplies raw elapsed time
      flowTime += dt * (0.06 + level * 0.04);
      uniforms.uTime.value = flowTime;
      uniforms.uLevel.value = level;
      uniforms.uBass.value = bass;

      targetForce *= Math.pow(0.04, dt);
      if (!active) {
        targetMouse.set(
          Math.cos(ambientT * 0.25) * vHeight * 0.35,
          Math.sin(ambientT * 0.21) * vHeight * 0.28
        );
        // gentle ambient motion only — don't force a permanent high push strength
        targetForce = Math.max(targetForce, 0.35);
      }

      smoothMouse.lerp(targetMouse, 1 - Math.pow(0.0015, dt));
      uniforms.uMouse.value.copy(smoothMouse);
      uniforms.uMouseForce.value +=
        (targetForce - uniforms.uMouseForce.value) * (1 - Math.pow(0.02, dt));

      // integrate spin per frame so angular velocity stays bounded
      spinY += dt * (0.012 + level * 0.028);
      spinX = Math.cos(ambientT * 0.05) * 0.06;
      points.rotation.y = Math.sin(ambientT * 0.06) * 0.12 + spinY;
      points.rotation.x = spinX;
      const targetZ = 24 - bass * 3.2;
      camera.position.x += (smoothMouse.x * 0.04 - camera.position.x) * 0.02;
      camera.position.y += (smoothMouse.y * 0.04 - camera.position.y) * 0.02;
      camera.position.z += (targetZ - camera.position.z) * 0.12;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#07080b]">
      <div ref={mountRef} className="absolute inset-0" />

      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, transparent 52%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* overlay */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        {/* top bar */}
        <div className="flex items-start justify-between p-6 sm:p-10">
          <a
            href="https://reesebrockman.com"
            className="pointer-events-auto font-mono text-xs uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white"
          >
            ← Reese Brockman
          </a>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            Live Visuals · macOS
          </span>
        </div>

        {/* center */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-accent/90">
            Coming soon
          </span>
          <h1
            className="text-6xl font-bold tracking-tight text-white sm:text-8xl"
            style={{ textShadow: "0 0 50px rgba(200,255,61,0.3)" }}
          >
            Notchster
          </h1>
          <p className="mt-6 max-w-md text-base text-white/70 sm:text-lg">
            A live-visuals instrument for musicians and DJs — perform your own
            reactive visuals straight from your Mac.
          </p>

          <button
            type="button"
            onClick={toggleMic}
            aria-pressed={micState === "on"}
            className={`pointer-events-auto mt-9 rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] backdrop-blur-sm transition-all ${
              micState === "on"
                ? "border-accent bg-accent/20 text-accent hover:bg-accent/30"
                : "border-accent/40 bg-accent/10 text-accent hover:border-accent/70 hover:bg-accent/20"
            }`}
          >
            {micState === "on"
              ? "● mic on — tap to turn off"
              : micState === "error"
                ? "mic blocked — tap to retry"
                : "▶ turn on mic"}
          </button>
          <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-white/30">
            {micState === "on"
              ? "reacting to your audio — make some noise"
              : "running on a synth beat · turn on the mic to react to sound"}
          </p>
        </div>

        {/* footer */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            Three.js · GLSL · Web Audio
          </span>
        </div>
      </div>
    </main>
  );
}
