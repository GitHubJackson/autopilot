/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from "three";
import robotModel from "@/assets/models/robot.glb";
import { loadGLTFWithPromise } from "../helper";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

export default class Robot {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  skeleton: any = null;
  mixer: any = null;
  mixers: any[] = [];
  actions: any[] = [];
  clock = new THREE.Clock();
  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.initialze();
  }

  loadRobotModel() {
    let self = this;
    const loadEgoCar = loadGLTFWithPromise(robotModel);
    return loadEgoCar.then((gltf) => {
      const robot = gltf.scene;
      robot.scale.set(0.15, 0.15, 0.15);
      robot.position.set(0.5, -0.5, 0.02);
      robot.rotateX(Math.PI / 2);
      const clips = gltf.animations;
      robot.traverse(function (object) {
        // @ts-ignore
        if (object.isMesh) object.castShadow = true;
      });
      // const skeleton = new THREE.SkeletonHelper(robot);
      const model1 = SkeletonUtils.clone(robot);
      const model2 = SkeletonUtils.clone(robot);
      const model3 = SkeletonUtils.clone(robot);
      const mixer1 = new THREE.AnimationMixer(model1);
      const mixer2 = new THREE.AnimationMixer(model2);
      const mixer3 = new THREE.AnimationMixer(model3);
      model1.position.x = -1;
      model2.position.y = -1;
      model3.position.y = 1;
      mixer1.clipAction(clips[0]).play(); // idle
      mixer2.clipAction(clips[1]).play(); // run
      mixer3.clipAction(clips[3]).play(); // walk
      this.scene.add(model3, model2);
      this.mixers.push(mixer1, mixer2, mixer3);
      setInterval(() => {
        animate();
      }, 50);
      function animate() {
        const delta = self.clock.getDelta();
        for (const mixer of self.mixers) mixer.update(delta);
      }
    });
  }

  activateAllActions() {
    //   setWeight(idleAction, settings["modify idle weight"]);
    //   setWeight(walkAction, settings["modify walk weight"]);
    //   setWeight(runAction, settings["modify run weight"]);
    this.actions.forEach(function (action) {
      action.play();
    });
  }

  async initialze() {
    await this.loadRobotModel();
  }
}
