import * as THREE from "three";
import { IColor, IPos } from "../types/common";

class RoadMarker {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw(data: IRoadMarker) {
    //
  }
}

export default RoadMarker;

export interface IRoadMarker {
  id: number;
  points: IPos[]; // 点集
  position: IPos; // 中心点
  rotation: number; // 偏转角
  color: string;
}
