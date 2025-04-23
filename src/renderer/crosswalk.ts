// import * as THREE from "three";
// import { IColor, IPos } from "../types/common";

// class Crosswalk {
//   scene = new THREE.Scene();

//   constructor(scene: THREE.Scene) {
//     this.scene = scene;
//   }

//   draw(data: ICrosswalk) {
//     //
//   }
// }

// export default Crosswalk;

// export interface ICrosswalk {
//   id: number;
//   position: IPos; // 中心点
//   points: IPos[]; // 点集, 相对中心点
//   rotation: number; // 偏转角
//   color: string;
// }

import { Vector2, Vector3 } from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

class OBox2 {
  points: Vector2[];
  boundingRect: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    angle: number;
  } | null;

  constructor(points: Vector2[]) {
    this.points = points.map((p) => new Vector2(p.x, p.y));
    this.boundingRect = this.computeMinBoundingRectangle();
  }

  // 旋转点的辅助函数
  rotatePoint(point: Vector2, angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = point.x * cos - point.y * sin;
    const y = point.x * sin + point.y * cos;
    return new Vector2(x, y);
  }

  // 获取最小旋转包围矩形
  private computeMinBoundingRectangle() {
    let minArea = Infinity;
    let bestRect = null;

    // 计算凸包
    const convexGeometry = new ConvexGeometry(
      this.points.map((p) => new Vector3(p.x, p.y, 0))
    );
    const positionAttribute = convexGeometry.getAttribute("position");
    const hullPoints = [];
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      hullPoints.push(new Vector2(x, y));
    }

    // 遍历凸包的每一条边
    for (let i = 0; i < hullPoints.length; i++) {
      const p1 = hullPoints[i];
      const p2 = hullPoints[(i + 1) % hullPoints.length];

      // 计算边的角度并旋转点集
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const rotatedPoints = this.points.map((p) => this.rotatePoint(p, -angle));

      // 计算旋转后的包围盒
      const minX = Math.min(...rotatedPoints.map((p) => p.x));
      const maxX = Math.max(...rotatedPoints.map((p) => p.x));
      const minY = Math.min(...rotatedPoints.map((p) => p.y));
      const maxY = Math.max(...rotatedPoints.map((p) => p.y));

      const width = maxX - minX;
      const height = maxY - minY;
      const area = width * height;

      // 找到面积最小的矩形
      if (area < minArea) {
        minArea = area;
        bestRect = { minX, minY, maxX, maxY, angle };
      }
    }

    return bestRect;
  }

  getBoundingRectPoints() {
    if (!this.boundingRect) return null;
    const { minX, maxX, minY, maxY, angle } = this.boundingRect;
    // 计算四个角点
    return [
      this.rotatePoint(new Vector2(maxX, maxY), angle), // 右上角
      this.rotatePoint(new Vector2(minX, maxY), angle), // 左上角
      this.rotatePoint(new Vector2(maxX, maxY), angle), // 右上角
      this.rotatePoint(new Vector2(maxX, minY), angle), // 右下角
      this.rotatePoint(new Vector2(maxX, minY), angle), // 右下角
      this.rotatePoint(new Vector2(minX, minY), angle), // 左下角
      this.rotatePoint(new Vector2(minX, minY), angle), // 左下角
      this.rotatePoint(new Vector2(minX, maxY), angle), // 左上角
    ];
  }
}

export default OBox2;
