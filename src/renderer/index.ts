import * as THREE from "three";
import carModel from "@/assets/models/su7.glb";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Freespace from "./freespace";
import {
  arrowData1,
  cubeData1,
  freespaceData1,
  freespaceData2,
  polygonCylinderData1,
  polygonCylinderData2,
  polygonCylinderData3,
  polygonCylinderData4,
} from "../mock/freespace";
import Cube from "./cube";
import Text from "./text";
import Arrow from "./arrow";
import PolygonCylinder from "./polygonCylinder";

const gltfLoader = new GLTFLoader();

class Renderer {
  egoCar = null;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  renderer = new THREE.WebGLRenderer();
  // 场景尺寸
  dimensions = [0, 0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers: Record<string, any> = {};

  constructor() {
    this.renderers = {
      freespace: () => new Freespace(this.scene),
      cube: () => new Cube(this.scene),
      text: () => new Text(this.scene),
      arrow: () => new Arrow(this.scene),
      polygonCylinder: () => new PolygonCylinder(this.scene),
    };
  }

  loadEgoCar() {
    gltfLoader.load(carModel, (gltf) => {
      const car = gltf.scene;
      car.scale.set(0.1, 0.1, 0.1);
      this.scene.add(car);
    });
  }

  initialize() {
    const container = document.getElementById("my-canvas")!;
    const width = container.offsetWidth,
      height = container.offsetHeight;
    this.dimensions = [width, height];
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.set(0, 1, 1.8);
    this.camera = camera;
    const scene = this.scene;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    this.renderer = renderer;
    // 设置背景色(颜色值，透明度)
    renderer.setClearColor(0x000000, 0.85);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    // light
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    directionalLight.position.set(60, 80, 40);
    // 方向光指向对象，默认指向是0,0,0
    // directionalLight.target = mesh;
    scene.add(directionalLight);
    // const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xff0000);
    // scene.add(dirLightHelper);
    // const axes = new THREE.AxesHelper(0.6);
    // axes.position.y = 0.05;
    // this.scene.add(axes);
    // 50表示网格模型的尺寸大小，25表示纵横细分线条数量
    const gridHelper = new THREE.GridHelper(50, 20);
    scene.add(gridHelper);
    this.loadEgoCar();
    this.registerDefaultEvents();
    setTimeout(() => {
      this.mockData();
    }, 5000);

    function animate() {
      controls.update();
      renderer.render(scene, camera);
    }
  }

  mockData() {
    this.renderers.freespace().draw(freespaceData1);
    this.renderers.freespace().draw(freespaceData2);
    this.renderers.cube().draw(cubeData1);
    this.renderers.arrow().draw(arrowData1);
    this.renderers.polygonCylinder().draw(polygonCylinderData1);
    this.renderers.polygonCylinder().draw(polygonCylinderData2);
    this.renderers.polygonCylinder().draw(polygonCylinderData3);
    this.renderers.polygonCylinder().draw(polygonCylinderData4);
  }

  registerDefaultEvents() {
    window.addEventListener("resize", this.onResize.bind(this), false);
  }
  unmountDefaultEvents() {
    window.removeEventListener("resize", this.onResize.bind(this), false);
  }
  onResize() {
    const container = document.getElementById("my-canvas")!;
    const width = container.offsetWidth,
      height = container.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

export const myRenderer = new Renderer();
