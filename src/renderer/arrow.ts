import * as THREE from "three";
import { IPos } from "../types/common";

class Arrow {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw(data: IArrow) {
    const arrowHelper = drawArrow(data);
    this.scene.add(arrowHelper);
  }
}

export default Arrow;

export function drawArrow(data: IArrow) {
  const { origin, endPoint, hex = 0xffff00 } = data;
  // 通过箭头起点和终点计算方向向量
  const dir = new THREE.Vector3(
    endPoint.x - origin.x,
    endPoint.y - origin.y,
    (endPoint.z ?? 0) - (origin.z ?? 0)
  );
  // 获取箭头长度
  const length = dir.length();
  const dirData = new THREE.Vector3(dir.x, dir.y, dir.z);
  dirData.normalize();
  const originPos = new THREE.Vector3(origin.x, origin.y, origin.z ?? 0);
  const arrowHelper = new THREE.ArrowHelper(dirData, originPos, length, hex);
  return arrowHelper;
}

export interface IArrow {
  id: string;
  // 箭头尾部坐标，用于确立方向
  endPoint: IPos;
  origin: IPos;
  length?: number;
  // 颜色哈希值
  hex?: string;
}
