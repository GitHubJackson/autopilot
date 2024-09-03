import * as THREE from "three";
import { IColor, IPos } from "../types/common";

export class PolygonCylinder {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw(data: IPolygonCylinder) {
    const { contour, height, color = { r: 0, g: 0, b: 0 } } = data;
    // 确保顶点顺序为逆时针
    if (THREE.ShapeUtils.isClockWise(contour)) {
      contour.reverse();
    }
    const vertices: number[][] = [];
    const normals: number[][] = [];
    const indexes: number[] = [];
    // 索引辅助下标
    let indexesIndex = 0;
    // 总共的顶点数量 = 顶面顶点+底面顶点
    // 确定顶面
    for (let i = 0; i < contour.length; i++) {
      const current = contour[i];
      vertices.push([current.x, current?.y + height, current.z]);
      normals.push([0, 1, 0]);
      // 设置顶面索引, 底面一般看不到, 所以可以不用设置索引
      // 三个点确定一个面, 注意按逆时针方向加入顶点索引
      if (i >= 2) {
        indexes[indexesIndex] = 0;
        indexes[indexesIndex + 1] = i - 1;
        indexes[indexesIndex + 2] = i;
        indexesIndex += 3;
      }
    }
    // 确定底面
    for (let i = 0; i < contour.length; i++) {
      const current = contour[i];
      vertices.push([current.x, current.y, current.z]);
      normals.push([-1, 0, -1]);
    }
    // 确定侧面, 这里复用下上下面的顶点就行
    for (let topIndex = 0; topIndex < contour.length; topIndex++) {
      const bottomIndex = topIndex + contour.length;
      // 终点处理, 这里的topIndex+1==底面起点, bottomIndex就是底部终点
      if (bottomIndex + 1 === 2 * contour.length) {
        indexes[indexesIndex] = topIndex;
        indexes[indexesIndex + 1] = bottomIndex;
        indexes[indexesIndex + 2] = topIndex + 1;
        indexes[indexesIndex + 3] = topIndex + 1;
        indexes[indexesIndex + 4] = 0;
        indexes[indexesIndex + 5] = topIndex;
      } else {
        // 一个面对应俩个三角形
        indexes[indexesIndex] = topIndex;
        indexes[indexesIndex + 1] = bottomIndex;
        indexes[indexesIndex + 2] = bottomIndex + 1;
        indexes[indexesIndex + 3] = bottomIndex + 1;
        indexes[indexesIndex + 4] = topIndex + 1;
        indexes[indexesIndex + 5] = topIndex;
      }
      indexesIndex += 6;
    }
    // 设置缓冲几何体属性
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices.flat(), 3)
    );
    // 自动计算法向量, 柱体结构不够清晰
    // geometry.computeVertexNormals();
    geometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normals.flat(), 3)
    );
    geometry.index = new THREE.Uint16BufferAttribute(indexes, 1);
    const polygonMaterial = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.8,
    });
    polygonMaterial.color.setRGB(color.r, color.g, color.b);
    const polygonMesh = new THREE.Mesh(geometry, polygonMaterial);
    this.scene.add(polygonMesh);
  }
}
export default PolygonCylinder;

export interface IPolygonCylinder {
  id: string;
  // 顶点，只需要顶面几个顶点
  contour: IPos[];
  // 高度
  height: number;
  color?: IColor;
}
