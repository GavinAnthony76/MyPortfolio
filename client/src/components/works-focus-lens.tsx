import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { projects } from "@/lib/projects-data";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexCurrent;
  uniform sampler2D uTexNext;
  uniform float uProgress;
  uniform float uDirection;
  uniform vec2 uResolution;
  uniform vec2 uLensCenter;
  uniform float uLensRadius;
  uniform float uTime;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 center = uLensCenter;
    vec2 diff = (uv - center) * aspect;
    float dist = length(diff);
    float radius = uLensRadius;

    float insideLens = smoothstep(radius + 0.008, radius - 0.008, dist);

    float displaceStrength = uProgress * 0.06;
    float n = noise(uv * 8.0 + uTime * 0.3);
    vec2 displace = vec2(
      sin(n * 6.28 + uv.y * 12.0) * displaceStrength * uDirection,
      cos(n * 6.28 + uv.x * 12.0) * displaceStrength * 0.3
    );

    vec2 uvCurrent = uv + displace * uProgress;
    vec2 uvNext = uv - displace * (1.0 - uProgress);

    vec4 colorCurrent = texture2D(uTexCurrent, uvCurrent);
    vec4 colorNext = texture2D(uTexNext, uvNext);

    float transitionMask = smoothstep(0.0, 1.0, uProgress);
    vec4 blended = mix(colorCurrent, colorNext, transitionMask);

    float vignette = smoothstep(0.0, radius * 1.8, dist);
    float outerDarken = mix(1.0, 0.35, vignette);
    float outerBlur = mix(0.0, 0.003, vignette);

    vec4 outerColor = texture2D(uTexCurrent, uv + vec2(outerBlur * sin(uv.y * 20.0), outerBlur * cos(uv.x * 20.0)));
    outerColor.rgb *= outerDarken;

    vec4 finalColor = mix(outerColor, blended, insideLens);

    finalColor.rgb *= mix(1.0, 0.92, vignette * 0.5);

    gl_FragColor = finalColor;
  }
`;

function loadTexture(
  loader: THREE.TextureLoader,
  src: string
): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    loader.load(
      src,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        resolve(tex);
      },
      undefined,
      () => {
        const canvas = document.createElement("canvas");
        canvas.width = 2;
        canvas.height = 2;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, 2, 2);
        const fallback = new THREE.CanvasTexture(canvas);
        resolve(fallback);
      }
    );
  });
}

interface LensCarouselProps {
  onIndexChange?: (index: number) => void;
}

export default function WorksFocusLens({ onIndexChange }: LensCarouselProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const indexRef = useRef(0);
  const progressRef = useRef(0);
  const directionRef = useRef(1);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragDeltaRef = useRef(0);
  const autoTimerRef = useRef(0);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    textures: THREE.Texture[];
    animFrame: number;
  } | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const total = projects.length;

  const commitTransition = useCallback(
    (dir: number) => {
      const sc = sceneRef.current;
      if (!sc) return;

      directionRef.current = dir;
      sc.material.uniforms.uDirection.value = dir;

      const nextIdx = ((indexRef.current + dir) % total + total) % total;
      sc.material.uniforms.uTexNext.value = sc.textures[nextIdx];

      gsap.to(progressRef, {
        current: 1,
        duration: 0.9,
        ease: "expo.out",
        onUpdate: () => {
          sc.material.uniforms.uProgress.value = progressRef.current;
        },
        onComplete: () => {
          indexRef.current = nextIdx;
          setCurrentIndex(nextIdx);
          onIndexChange?.(nextIdx);
          sc.material.uniforms.uTexCurrent.value = sc.textures[nextIdx];
          sc.material.uniforms.uProgress.value = 0;
          progressRef.current = 0;
          resetAutoTimer();
        },
      });
    },
    [total, onIndexChange]
  );

  const resetAutoTimer = useCallback(() => {
    clearInterval(autoTimerRef.current);
    autoTimerRef.current = window.setInterval(() => {
      if (!isDraggingRef.current) {
        commitTransition(1);
      }
    }, 6000);
  }, [commitTransition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

    const isMobile = w < 768;
    const lensR = isMobile ? 0.28 : 0.22;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexCurrent: { value: null },
        uTexNext: { value: null },
        uProgress: { value: 0 },
        uDirection: { value: 1 },
        uResolution: { value: new THREE.Vector2(w, h) },
        uLensCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uLensRadius: { value: lensR },
        uTime: { value: 0 },
      },
    });

    const geo = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    const imgSrcs = projects.map((p) => p.image);

    Promise.all(imgSrcs.map((src) => loadTexture(loader, src))).then(
      (textures) => {
        material.uniforms.uTexCurrent.value = textures[0];
        material.uniforms.uTexNext.value = textures[1] || textures[0];

        sceneRef.current = {
          renderer,
          scene,
          camera,
          material,
          textures,
          animFrame: 0,
        };

        setLoaded(true);
        resetAutoTimer();
      }
    );

    let animFrame = 0;
    const startTime = performance.now();
    const animate = () => {
      animFrame = requestAnimationFrame(animate);
      material.uniforms.uTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderer.setSize(nw, nh);
      material.uniforms.uResolution.value.set(nw, nh);
      material.uniforms.uLensRadius.value = nw < 768 ? 0.28 : 0.22;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrame);
      clearInterval(autoTimerRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geo.dispose();
      material.dispose();
    };
  }, [resetAutoTimer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const threshold = window.innerWidth * 0.12;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragDeltaRef.current = 0;
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !sceneRef.current) return;
      const delta = e.clientX - dragStartXRef.current;
      dragDeltaRef.current = delta;
      const prog = Math.min(Math.abs(delta) / (window.innerWidth * 0.3), 1);
      const dir = delta < 0 ? 1 : -1;

      const sc = sceneRef.current;
      const nextIdx =
        ((indexRef.current + dir) % total + total) % total;
      sc.material.uniforms.uTexNext.value = sc.textures[nextIdx];
      sc.material.uniforms.uProgress.value = prog * 0.5;
      sc.material.uniforms.uDirection.value = dir;
      directionRef.current = dir;
      progressRef.current = prog * 0.5;
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      container.style.cursor = "grab";

      const delta = dragDeltaRef.current;
      if (Math.abs(delta) > threshold) {
        const dir = delta < 0 ? 1 : -1;
        commitTransition(dir);
      } else {
        const sc = sceneRef.current;
        if (sc) {
          gsap.to(progressRef, {
            current: 0,
            duration: 0.4,
            ease: "expo.out",
            onUpdate: () => {
              sc.material.uniforms.uProgress.value = progressRef.current;
            },
          });
        }
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [total, commitTransition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") commitTransition(-1);
      if (e.key === "ArrowRight") commitTransition(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commitTransition]);

  useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        commitTransition(diff > 0 ? 1 : -1);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [commitTransition]);

  const project = projects[currentIndex];
  const yearFirst = project.year.slice(0, 2);
  const yearLast = project.year.slice(2);

  if (!webglSupported) {
    return <CSSFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-hidden bg-black relative select-none"
      style={{ cursor: "grab" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div
        className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1.2s" }}
      >
        <div className="absolute left-0 right-0 top-1/2 flex items-center pointer-events-none">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <div style={{ width: "min(44vh, 44vw)" }} />
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <Link href={`/works/${project.id}`}>
          <div className="flex flex-col items-center justify-center pointer-events-auto cursor-pointer group z-10">
            <h2 className="project-title text-white text-center text-lg sm:text-xl lg:text-2xl tracking-[0.15em] mb-1 group-hover:opacity-70 transition-opacity">
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="project-title text-white/35 text-center text-xs sm:text-sm tracking-[0.12em]">
                {project.subtitle}
              </p>
            )}
          </div>
        </Link>
      </div>

      <button
        onClick={() => commitTransition(-1)}
        className={`absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 flex items-center gap-4 text-white/25 hover:text-white/60 transition-all z-20 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "0.3s" }}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase">Prev</span>
        <div className="w-12 sm:w-20 h-px bg-current" />
      </button>

      <button
        onClick={() => commitTransition(1)}
        className={`absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 flex items-center gap-4 text-white/25 hover:text-white/60 transition-all z-20 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "0.3s" }}
      >
        <div className="w-12 sm:w-20 h-px bg-current" />
        <span className="text-[10px] tracking-[0.25em] uppercase">Next</span>
      </button>

      <div
        className={`absolute bottom-8 right-6 sm:right-10 flex items-center gap-3 z-20 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1s", transitionDelay: "0.5s" }}
      >
        <span className="text-white/40 text-xs sm:text-sm font-light tracking-[0.1em]">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-white/15 text-[10px]">——</span>
        <span className="text-white/40 text-xs sm:text-sm font-light tracking-[0.1em]">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div
        className={`absolute bottom-8 left-6 sm:left-10 flex items-center gap-3 z-20 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1s", transitionDelay: "0.5s" }}
      >
        <span className="text-white/30 text-xs font-light tracking-[0.1em]">
          {yearFirst}
        </span>
        <span className="text-white/10 text-[10px]">——</span>
        <span className="text-white/30 text-xs font-light tracking-[0.1em]">
          {yearLast}
        </span>
      </div>
    </div>
  );
}

function CSSFallback() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = projects.length;
  const project = projects[currentIndex];

  const goTo = useCallback(
    (dir: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => ((prev + dir) % total + total) % total);
        setIsTransitioning(false);
      }, 600);
    },
    [isTransitioning, total]
  );

  useEffect(() => {
    const interval = setInterval(() => goTo(1), 6000);
    return () => clearInterval(interval);
  }, [goTo]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative select-none">
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          transitionDuration: "0.7s",
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full border border-white/10"
          style={{
            width: "min(50vh, 50vw)",
            height: "min(50vh, 50vw)",
            backdropFilter: "blur(0px)",
            boxShadow: "0 0 80px 40px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <Link href={`/works/${project.id}`}>
            <h2 className="project-title text-white text-lg sm:text-xl lg:text-2xl tracking-[0.15em] cursor-pointer hover:opacity-70 transition-opacity">
              {project.title}
            </h2>
          </Link>
        </div>
      </div>

      <button
        onClick={() => goTo(-1)}
        className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 flex items-center gap-4 text-white/25 hover:text-white/60 transition-colors z-20"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase">Prev</span>
        <div className="w-12 sm:w-20 h-px bg-current" />
      </button>

      <button
        onClick={() => goTo(1)}
        className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 flex items-center gap-4 text-white/25 hover:text-white/60 transition-colors z-20"
      >
        <div className="w-12 sm:w-20 h-px bg-current" />
        <span className="text-[10px] tracking-[0.25em] uppercase">Next</span>
      </button>

      <div className="absolute bottom-8 right-6 sm:right-10 flex items-center gap-3 z-20">
        <span className="text-white/40 text-xs font-light tracking-[0.1em]">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-white/15 text-[10px]">——</span>
        <span className="text-white/40 text-xs font-light tracking-[0.1em]">
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
