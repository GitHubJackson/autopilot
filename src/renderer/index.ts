/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { OrbitControls } from "../helper/three/OrbitControls.js";
import Freespace from "./freespace";
import {
  arrowData1,
  cubeData1,
  cubeData2,
  cubeData3,
  cubeData4,
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
import Line from "./line";
import { lineData1, lineData2, lineData3, lineData4 } from "../mock/line";
import { EViewType } from "../types/renderer";
import EgoCar from "./egoCar";
import Robot from "./robot";
import { Easing, Tween } from "@tweenjs/tween.js";
import * as TWEEN from "@tweenjs/tween.js";

const manager = new THREE.LoadingManager();
manager.onLoad = () => {
  console.log("===Loading complete!");
};
manager.onProgress = (url, loaded, total) => {
  console.log("===loading", url, loaded, total);
};

const fakeCameraDirection = new THREE.Vector3();
const tweenGroup = new TWEEN.Group();

class Renderer {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  fakeCamera = new THREE.PerspectiveCamera();
  resetCamera = new THREE.PerspectiveCamera();
  controls: OrbitControls | null = null;
  renderer = new THREE.WebGLRenderer();
  // 场景尺寸
  dimensions = [0, 0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers: Record<string, any> = {};

  egoCar: EgoCar | null = null;
  robot: any = null;

  constructor() {
    this.renderers = {
      freespace: () => new Freespace(this.scene),
      cube: () => new Cube(this.scene, this.camera),
      text: () => new Text(this.scene),
      arrow: () => new Arrow(this.scene),
      polygonCylinder: () => new PolygonCylinder(this.scene),
      line: () => new Line(this.scene),
    };
  }

  initialize() {
    const container = document.getElementById("my-canvas")!;
    const width = container.offsetWidth,
      height = container.offsetHeight;
    // @ts-ignore
    window.canvasRef = {
      container,
      width,
      height,
    };
    this.dimensions = [width, height];
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.up.set(0, 0, 1);
    camera.position.set(-4, -0.4, 1.4);
    this.camera = camera;
    const scene = this.scene;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    this.renderer = renderer;
    // 设置背景色(颜色值，透明度)
    renderer.setClearColor(0x000000, 0.8);
    container.appendChild(renderer.domElement);
    const fakeCamera = camera.clone();
    const controls = new OrbitControls(fakeCamera, renderer.domElement);
    this.fakeCamera = fakeCamera;
    this.resetCamera = this.fakeCamera.clone();
    this.controls = controls;
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
    // axes.position.z = 0.05;
    // this.scene.add(axes);
    // 50表示网格模型的尺寸大小，25表示纵横细分线条数量
    const gridHelper = new THREE.GridHelper(50, 20);
    gridHelper.rotateX(Math.PI / 2);
    scene.add(gridHelper);
    const egoCar = new EgoCar(scene, camera);
    this.camera.lookAt(egoCar.group.position);
    this.egoCar = egoCar;
    this.robot = new Robot(scene, renderer);
    this.registerDefaultEvents();

    // // 屏幕相机
    // TODO 配合fakeCamera有点问题
    // const camera2 = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    // camera2.position.set(-10, -5, 4);
    // // camera2.lookAt(0, 0, 0);
    // camera2.up.set(0, 0, 1);
    // // 观察原有相机
    // const cameraHelper = new THREE.CameraHelper(camera);
    // scene.add(cameraHelper);
    // const controls = new OrbitControls(camera2, renderer.domElement);
    // this.controls = controls;

    setTimeout(() => {
      this.mockData();
    }, 5000);

    const animate = () => {
      this.updateCamera();
      tweenGroup.update();
      this.controls!.update();
      this.renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);
  }

  updateCamera = () => {
    if (this.egoCar) {
      const position = this.egoCar.group.position;
      const rotation = this.egoCar.group.rotation;
      // 将 fakeCamera 的属性同步给 camera
      this.camera.copy(this.fakeCamera);
      const x = this.fakeCamera.position.x;
      const y = this.fakeCamera.position.y;
      // 相机和自车保持一个固定的偏移
      // camera.position.x = position.x + x;
      // camera.position.y = position.y + y;
      this.fakeCamera.getWorldDirection(fakeCameraDirection);
      const directionTheta = Math.atan2(
        fakeCameraDirection.y,
        fakeCameraDirection.x
      );
      const camera2egocarDistance = Math.sqrt(x * x + y * y);
      this.camera.position.x =
        position.x -
        camera2egocarDistance * Math.cos(rotation.z + directionTheta);
      this.camera.position.y =
        position.y -
        camera2egocarDistance * Math.sin(rotation.z + directionTheta);
      this.camera.lookAt(position.x, position.y, position.z);
    }
  };

  runEgoCar() {
    if (this.egoCar) {
      const animate2 = new Tween(this.egoCar.group.position)
        .to(
          {
            y: -0.5,
          },
          2000
        )
        .start();
      const animate = new Tween(this.egoCar.group.position)
        .delay(500)
        .to(
          {
            x: 10,
          },
          5000
        )
        .easing(Easing.Quadratic.In)
        .start();
      const rotationAnimate = new Tween(this.egoCar.group.rotation)
        .to(
          {
            z: -Math.PI / 4,
          },
          1200
        )
        // .easing(Easing.Quadratic.InOut)
        .start()
        .onComplete(() => {
          const rotationAnimate2 = new Tween(this.egoCar!.group.rotation)
            .to(
              {
                z: 0,
              },
              1600
            )
            // .easing(Easing.Quadratic.InOut)
            .start();
          tweenGroup.add(rotationAnimate2);
        });
      tweenGroup.add(animate, animate2, rotationAnimate);
    }
  }

  runOtherCar() {
    if (this.otherCar2) {
      const animate = new Tween(this.otherCar2.position)
        .delay(2000)
        .easing(Easing.Quadratic.InOut)
        .to(
          {
            x: 10,
          },
          5000
        )
        .start();
      tweenGroup.add(animate);
    }
    if (this.otherCar3) {
      const animate2 = new Tween(this.otherCar3.position)
        .delay(1500)
        .easing(Easing.Quadratic.InOut)
        .to(
          {
            x: 9.4,
          },
          6000
        )
        .start();
      tweenGroup.add(animate2);
    }
    if (this.otherCar4) {
      const animate3 = new Tween(this.otherCar4.position)
        .delay(800)
        .easing(Easing.Quadratic.InOut)
        .to(
          {
            x: 12,
          },
          6000
        )
        .start();
      tweenGroup.add(animate3);
    }
  }

  otherCar2: THREE.Mesh | null = null;
  otherCar3: THREE.Mesh | null = null;
  otherCar4: THREE.Mesh | null = null;
  mockData() {
    this.renderers.freespace().draw(freespaceData1);
    this.renderers.freespace().draw(freespaceData2);
    const otherCars = this.renderers
      .cube()
      .draw([cubeData1, cubeData2, cubeData3, cubeData4]);
    this.otherCar2 = otherCars[1];
    this.otherCar3 = otherCars[2];
    this.otherCar4 = otherCars[3];
    // this.renderers.cube().draw(cubeData4);
    // this.renderers.arrow().draw(arrowData1);
    // this.renderers.polygonCylinder().draw(polygonCylinderData1);
    // this.renderers.polygonCylinder().draw(polygonCylinderData2);
    // this.renderers.polygonCylinder().draw(polygonCylinderData3);
    // this.renderers.polygonCylinder().draw(polygonCylinderData4);
    this.renderers.line().draw(lineData1);
    this.renderers.line().draw(lineData2);
    this.renderers.line().draw(lineData3);
    // this.renderers.line().draw(lineData4);
    this.runEgoCar();
    this.runOtherCar();
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
    // @ts-ignore
    window.canvasRef.width = width;
    // @ts-ignore
    window.canvasRef.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  resetFakeCamera = () => {
    this.fakeCamera.copy(this.resetCamera);
    this.controls!.reset();
  };

  cameraView = EViewType.FollowCar;
  switchCameraView(view = EViewType.FollowCar) {
    // TODO 切换时有一个闪屏
    this.cameraView = view;
    switch (view) {
      case EViewType.FollowCar: {
        this.resetFakeCamera();
        this.fakeCamera.position.set(-4, -0.4, 1.4);
        break;
      }
      case EViewType.Overlook: {
        this.resetFakeCamera();
        this.fakeCamera.position.set(0, 0, 20);
        break;
      }
      case EViewType.OverlookVertical: {
        this.resetFakeCamera();
        this.fakeCamera.position.set(0, 0, 20);
        // this.fakeCamera.rotation.x = -Math.PI / 2;
        this.controls.rotate(Math.PI / 2);
        break;
      }
      default:
        break;
    }
  }
}

export const myRenderer = new Renderer();
