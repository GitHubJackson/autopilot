/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from "three";
import carModelWithDraco from "@/assets/models/su7-draco.glb";
import haloImg from "@/assets/textures/halo.png";
import { abortWrapper } from "../../helper/promise";
import { loadDracoGLTFWithPromise, loadTexture } from "../../helper";
import { Easing, Tween } from "@tweenjs/tween.js";

export default class EgoCar {
  scene = new THREE.Scene();
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initialze();
  }

  loadEgoCar() {
    const loadEgoCar = abortWrapper(
      loadDracoGLTFWithPromise(carModelWithDraco)
    );
    return loadEgoCar.then((gltf) => {
      const car = gltf.scene;
      car.scale.set(0.1, 0.1, 0.1);
      car.rotateX(Math.PI / 2);
      car.rotateY(Math.PI);
      this.scene.add(car);
    });
  }

  async initialze() {
    await this.loadEgoCar();
    await this.drawDynamicHalo();
    await this.drawFrontLight();
  }

  async drawDynamicHalo() {
    // const egoCarHalo = await loadTexture(haloImg);
    const geometry = new THREE.CircleGeometry(0.1, 32);
    const material = getHaloShader({});
    // const material = new THREE.MeshBasicMaterial({
    //   map: egoCarHalo,
    //   transparent: true,
    // });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0.05;
    this.scene.add(mesh);
    const tweenScale = new Tween(mesh.scale)
      .to({ x: 6, y: 6, z: 1 }, 1000)
      .easing(Easing.Quadratic.In)
      .start()
      .onStart(() => {
        mesh.material.opacity = 1;
      });
    const tweenOpacity = new Tween(mesh.material).to({ opacity: 0.1 }, 300);
    // 衔接两种补间动画
    tweenScale.chain(tweenOpacity);
    tweenOpacity.chain(tweenScale);
    // 可以直接用定时器做更新
    setInterval(() => {
      tweenScale.update();
      tweenOpacity.update();
    }, 50);
  }

  drawFrontLight() {
    const target1 = new THREE.Object3D();
    target1.position.set(0.1, -0.2, 0.3);
    const light1 = new THREE.SpotLight("#fff", 1.2, 3, Math.PI / 6, 0.1);
    light1.position.set(0.1, 0.2, 0.3);
    light1.castShadow = true;
    light1.target = target1;
    this.scene.add(target1);
    this.scene.add(light1);
    const target2 = new THREE.Object3D();
    target2.position.set(-0.1, -0.2, 0.3);
    const light2 = new THREE.SpotLight("#fff", 1.2, 2, Math.PI / 6, 0.1);
    light2.position.set(-0.1, 0.2, 0.3);
    light2.castShadow = true;
    light2.target = target2;
    this.scene.add(target2);
    this.scene.add(light2);
  }
}

export function getHaloShader(option: {
  // 最大半径
  radius?: number;
  // 初始透明度
  opacity?: number;
  // 颜色定义
  color?: string;
}) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      radius: { value: option.radius ?? 1 },
      opacity: { value: option.opacity ?? 0.5 },
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
      varying vec2 vUv;  
      void main() {
        float radius = length(vUv - 0.5); // uv坐标到中心的距离
        float alpha = smoothstep(0.3, 0.5, radius);
        gl_FragColor = vec4(color.rgb, alpha);
      }
    `,
  });
  material.transparent = true;
  material.side = THREE.FrontSide;
  return material;
}
