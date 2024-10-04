import * as THREE from "three";
import { IColor, IPos } from "../types/common";

class Crosswalk {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw(data: ICrosswalk) {
    //
  }
}

export default Crosswalk;

export interface ICrosswalk {
  id: number;
  position: IPos; // 中心点
  points: IPos[]; // 点集, 相对中心点
  rotation: number; // 偏转角
  color: string;
}
