import * as THREE from "three";
import { IColor, IPos } from "../types/common";

class Polygon {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw() {
    // const { contour, color = { r: 0, g: 0, b: 0 } } = data;
    const geometry = new THREE.BufferGeometry();
    // 一个面是俩个三角形，注意顶点要按逆时针排序
    const vertices = [
      // 正面
      { position: [-1, -1, 1], normal: [0, 0, 1] },
      { position: [1, -1, 1], normal: [0, 0, 1] },
      { position: [-1, 1, 1], normal: [0, 0, 1] },
      { position: [-1, 1, 1], normal: [0, 0, 1] },
      { position: [1, -1, 1], normal: [0, 0, 1] },
      { position: [1, 1, 1], normal: [0, 0, 1] },
      // 背面
      { position: [1, -1, -1], normal: [0, 0, -1] },
      { position: [-1, -1, -1], normal: [0, 0, -1] },
      { position: [1, 1, -1], normal: [0, 0, -1] },
      { position: [1, 1, -1], normal: [0, 0, -1] },
      { position: [-1, -1, -1], normal: [0, 0, -1] },
      { position: [-1, 1, -1], normal: [0, 0, -1] },
      // 右面
      { position: [1, -1, 1], normal: [1, 0, 0] },
      { position: [1, -1, -1], normal: [1, 0, 0] },
      { position: [1, 1, 1], normal: [1, 0, 0] },
      { position: [1, 1, 1], normal: [1, 0, 0] },
      { position: [1, -1, -1], normal: [1, 0, 0] },
      { position: [1, 1, -1], normal: [1, 0, 0] },
      // 左面
      { position: [-1, -1, -1], normal: [-1, 0, 0] },
      { position: [-1, -1, 1], normal: [-1, 0, 0] },
      { position: [-1, 1, -1], normal: [-1, 0, 0] },
      { position: [-1, 1, -1], normal: [-1, 0, 0] },
      { position: [-1, -1, 1], normal: [-1, 0, 0] },
      { position: [-1, 1, 1], normal: [-1, 0, 0] },
      // 上面
      { position: [1, 1, -1], normal: [0, 1, 0] },
      { position: [-1, 1, -1], normal: [0, 1, 0] },
      { position: [1, 1, 1], normal: [0, 1, 0] },
      { position: [1, 1, 1], normal: [0, 1, 0] },
      { position: [-1, 1, -1], normal: [0, 1, 0] },
      { position: [-1, 1, 1], normal: [0, 1, 0] },
      // 下面
      { position: [1, -1, 1], normal: [0, -1, 0] },
      { position: [-1, -1, 1], normal: [0, -1, 0] },
      { position: [1, -1, -1], normal: [0, -1, 0] },
      { position: [1, -1, -1], normal: [0, -1, 0] },
      { position: [-1, -1, 1], normal: [0, -1, 0] },
      { position: [-1, -1, -1], normal: [0, -1, 0] },
    ];
    const positions = [];
    const normals = [];
    for (const vertex of vertices) {
      positions.push(...vertex.position);
      normals.push(...vertex.normal);
    }
    // geometry.computeVertexNormals();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    geometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(new Float32Array(normals), 3)
    );
    const polygonMaterial = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.2,
    });
    polygonMaterial.color.set(0, 1, 0);
    const mesh = new THREE.Mesh(geometry, polygonMaterial);
    this.scene.add(mesh);
  }
}

export default Polygon;

export interface IPolygon {
  // 一般可以用于判断元素是否可复用
  id: string;
  // 顶点
  contour: IPos[];
  color?: IColor;
  // 高度
  height?: number;
}
