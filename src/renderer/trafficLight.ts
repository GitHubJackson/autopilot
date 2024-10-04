import * as THREE from "three";
import { IColor, IPos } from "../types/common";

class TrafficLight {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw(data: ITrafficLight) {
    //
  }
}

export default TrafficLight;

export interface ITrafficLight {
  id: number;
  points: IPos[]; // 点集
  position: IPos; // 中心点
  rotation: number; // 偏转角
  color: string;
}
