/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from "three";
import carModelWithDraco from "@/assets/models/su7-draco.glb";
import haloImg from "@/assets/textures/halo.png";
import { abortWrapper } from "../../helper/promise";
import { loadDracoGLTFWithPromise, loadTexture } from "../../helper";
import { Easing, Tween } from "@tweenjs/tween.js";

const egoCarLabelString = "egoCar-label";

export default class EgoCar {
  scene = new THREE.Scene();
  camera = new THREE.Camera();
  group = new THREE.Group();
  car = new THREE.Group();
  container: HTMLCanvasElement | null = null;
  showLabel = false;
  carData = {
    name: "egoCar",
    velocity: {
      x: 10,
      y: 20,
    },
  };

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.group.position.set(0, 0, 0);
    this.initialze();
    this.clickObject = this.clickObject.bind(this);
    this.triggerLabelBox = this.triggerLabelBox.bind(this);
    this.updateLabelBox = this.updateLabelBox.bind(this);
    // @ts-ignore
    window.canvasRef.container.addEventListener("click", this.clickObject);
    // @ts-ignore
    this.container = window.canvasRef.container;
  }

  clickObject(e: any) {
    // @ts-ignore
    const canvasRef = window.canvasRef;
    const mouseVector = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    mouseVector.x = (e.offsetX / canvasRef.width) * 2 - 1;
    mouseVector.y = -(e.offsetY / canvasRef.height) * 2 + 1;
    raycaster.setFromCamera(mouseVector, this.camera);
    // @ts-ignore
    const intersects = raycaster.intersectObjects(this.car.children, true);
    if (intersects.length > 0) {
      this.triggerLabelBox();
    }
  }

  triggerLabelBox() {
    const canvasContainer = this.container!;
    const dom = document.getElementById(egoCarLabelString);
    if (!dom) {
      const newBox = document.createElement("div");
      newBox.setAttribute("id", egoCarLabelString);
      newBox.setAttribute("class", "label-box");
      canvasContainer.appendChild(newBox);
      this.updateLabelBox(newBox);
      this.showLabel = true;
    } else {
      if (!this.showLabel) {
        dom.style.display = "block";
        this.updateLabelBox(dom);
        this.showLabel = true;
      } else {
        dom.style.display = "none";
        this.showLabel = false;
      }
    }
  }

  updateLabelBox(dom: HTMLElement) {
    // @ts-ignore
    const canvasRef = window.canvasRef;
    const x = this.group.position.x;
    const y = this.group.position.y;
    const groupVector = new THREE.Vector3(x, y, 0.1);
    // 将世界坐标转为标准设备坐标
    groupVector.project(this.camera);
    const w = canvasRef.width / 2;
    const h = canvasRef.height / 2;
    const screenX = Math.round(groupVector.x * w + w);
    const screenY = Math.round(-groupVector.y * h + h);
    dom.innerText = `${this.carData.name}\nvx:${this.carData.velocity.x} vy:${this.carData.velocity.y}`;
    dom.style.transform = `translate(${screenX}px,${screenY}px)`;
  }

  loadEgoCar() {
    const loadEgoCar = abortWrapper(
      loadDracoGLTFWithPromise(carModelWithDraco)
    );
    return loadEgoCar.then((gltf) => {
      const car = gltf.scene;
      car.scale.set(0.1, 0.1, 0.1);
      car.rotateX(Math.PI / 2);
      car.rotateY(-Math.PI / 2);
      this.car = car;
      this.group.add(car);
      this.scene.add(this.group);
    });
  }

  async initialze() {
    await this.loadEgoCar();
    await this.drawDynamicHalo();
    await this.drawFrontLight();
  }

  async drawDynamicHalo() {
    // const egoCarHalo = await loadTexture(haloImg);
    const geometry = new THREE.CircleGeometry(0.05, 32);
    const material = getHaloShaderWithAngle({});
    // const material = new THREE.MeshBasicMaterial({
    //   map: egoCarHalo,
    //   transparent: true,
    // });
    const mesh = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(geometry.clone(), material.clone());
    const mesh3 = new THREE.Mesh(geometry.clone(), material.clone());
    mesh.position.z = 0.02;
    mesh2.position.z = 0.02;
    mesh3.position.z = 0.02;
    this.group.add(mesh);
    this.group.add(mesh2);
    this.group.add(mesh3);
    const tweenScale = new Tween(mesh.scale)
      .to({ x: 12, y: 12, z: 1 }, 3000)
      .start(500)
      .onStart(() => {
        mesh.material.uniforms.opacity.value = 1;
      });
    const tweenOpacity = new Tween(mesh.material.uniforms.opacity).to(
      { value: 0.1 },
      500
    );
    const tweenScale2 = new Tween(mesh2.scale)
      .to({ x: 12, y: 12, z: 1 }, 3000)
      .start(2000)
      .onStart(() => {
        mesh2.material.uniforms.opacity.value = 1;
      });
    const tweenOpacity2 = new Tween(mesh2.material.uniforms.opacity).to(
      { value: 0.1 },
      500
    );
    const tweenScale3 = new Tween(mesh3.scale)
      .to({ x: 12, y: 12, z: 1 }, 3000)
      .start(3000)
      .onStart(() => {
        mesh3.material.uniforms.opacity.value = 1;
      });
    const tweenOpacity3 = new Tween(mesh3.material.uniforms.opacity).to(
      { value: 0.1 },
      500
    );
    // 衔接两种补间动画
    tweenScale.chain(tweenOpacity);
    tweenOpacity.chain(tweenScale);
    tweenScale2.chain(tweenOpacity2);
    tweenOpacity2.chain(tweenScale2);
    tweenScale3.chain(tweenOpacity3);
    tweenOpacity3.chain(tweenScale3);
    // 可以直接用定时器做更新
    setInterval(() => {
      tweenScale.update();
      tweenOpacity.update();
      tweenScale2.update();
      tweenOpacity2.update();
      tweenScale3.update();
      tweenOpacity3.update();
    }, 50);
  }

  drawFrontLight() {
    const target1 = new THREE.Object3D();
    target1.position.set(0.2, 0.1, 0.3);
    const light1 = new THREE.SpotLight("#fff", 1.2, 2, Math.PI / 6, 0.1);
    light1.position.set(-0.2, 0.1, 0.3);
    light1.castShadow = true;
    light1.target = target1;
    this.group.add(target1);
    this.group.add(light1);
    const target2 = new THREE.Object3D();
    target2.position.set(0.2, -0.1, 0.3);
    const light2 = new THREE.SpotLight("#fff", 1.2, 2, Math.PI / 6, 0.1);
    light2.position.set(-0.2, -0.1, 0.3);
    light2.castShadow = true;
    light2.target = target2;
    this.group.add(target2);
    this.group.add(light2);
  }
}

export function getHaloShader(option: {
  // 最大半径
  radius?: number;
  opacity?: number;
  // 颜色定义
  color?: string;
}) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      radius: { value: option.radius ?? 1 },
      opacity: { value: option.opacity ?? 1.0 },
      color: {
        value: option.color ?? new THREE.Color("#00ffff"),
      },
    },
    vertexShader: `
      varying vec2 vUv;  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      } 
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float opacity;
      varying vec2 vUv;  
      void main() {
        float radius = length(vUv - 0.5); // uv坐标到中心的距离
        float alpha = smoothstep(0.36, 0.5, radius) * opacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
  material.transparent = true;
  material.side = THREE.FrontSide;
  return material;
}

export function getHaloShaderWithAngle(option: {
  // 最大半径
  radius?: number;
  opacity?: number;
  angle?: number;
  // 颜色定义
  color?: string;
}) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      radius: { value: option.radius ?? 1 },
      opacity: { value: option.opacity ?? 1.0 },
      angle: { value: option.angle ?? Math.PI / 2 },
      color: {
        value: option.color ?? new THREE.Color("#00ffff"),
      },
    },
    vertexShader: `
      varying vec2 vUv;  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      } 
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float opacity;
      varying vec2 vUv;  
      void main() {
        // 假设vUv.x的范围是0到1，我们需要将其映射到0到2π（或你想要的扇形角度范围）  
        float startAngle = 0.0; // 扇形的起始角度（弧度）  
        float endAngle = 3.14159 * 2.0; // 扇形的结束角度（弧度），这里是一个90度的扇形  
        float angleRange = endAngle - startAngle;  
          
        // 将vUv.x从0-1映射到startAngle-endAngle  
        float angle = startAngle + vUv.y * angleRange;  
          
        float radius = length(vUv - 0.5); // uv坐标到中心的距离
        float alpha = smoothstep(0.36, 0.5, radius) * opacity;
        // 检查当前角度是否在扇形范围内  
        if (angle >= startAngle && angle <= endAngle) {  
            gl_FragColor = vec4(color, alpha);
        } else {  
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // 在不支持discard的上下文中  
        }

      }
    `,
  });
  material.transparent = true;
  material.side = THREE.FrontSide;
  material.depthWrite = false;
  return material;
}
