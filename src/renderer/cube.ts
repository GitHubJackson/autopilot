import * as THREE from "three";
import { IColor, IPos } from "../types/common";
import crateGif from "@/assets/textures/crate.gif";
import { renderTextMesh } from "./text";
import { drawArrow } from "./arrow";
import { loadTexture } from "../helper";

type TextCache = Record<string, THREE.Mesh>;

class Cube {
  scene = new THREE.Scene();
  textCache: TextCache = {};

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw(data: ICube) {
    const { id, type, position, color, width, height, length } = data;
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.2,
    });
    material.color.setRGB(color.r, color.g, color.b);
    const geometry = new THREE.BoxGeometry(width, height, length);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z ?? 0);
    mesh.rotateX(Math.PI / 2);
    group.add(mesh);
    const edges = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial();
    edgesMaterial.color.setRGB(color.r, color.g, color.b);
    const line = new THREE.LineSegments(edges, edgesMaterial);
    line.position.copy(mesh.position);
    line.rotation.copy(mesh.rotation);
    group.add(line);

    // // 绘制顶部文字
    // const text = id + "-" + type;
    // if (this.textCache[text]) {
    //   const textMesh = this.textCache[text];
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   mesh.textMesh = textMesh;
    //   group.add(textMesh);
    // } else {
    //   const textMesh = renderTextMesh({
    //     id: text,
    //     content: text,
    //     position: {
    //       x: mesh.position.x + width,
    //       y: mesh.position.y + height / 2 + 0.1,
    //       z: mesh.position.z,
    //     },
    //   });
    //   // 挂载到他车Mesh上
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   mesh.textMesh = textMesh;
    //   group.add(textMesh);
    // }
    // // 绘制朝向箭头
    // const arrowMesh = drawArrow({
    //   id: data.id + "-" + "arrow",
    //   endPoint: {
    //     x: mesh.position.x,
    //     y: mesh.position.y,
    //     z: mesh.position.z - length,
    //   },
    //   origin: {
    //     x: mesh.position.x,
    //     y: mesh.position.y,
    //     z: mesh.position.z,
    //   },
    // });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // mesh.arrowMesh = arrowMesh;
    // group.add(arrowMesh);
    this.scene.add(group);
    // MOCK
    // const group2 = group.clone();
    // group2.scale.set(0.5, 0.5, 0.5);
    // group2.position.set(3, 0, -3);
    // group2.rotateY(0.2);
    // this.scene.add(group2);
    // const group3 = group.clone();
    // group3.scale.set(0.6, 0.6, 0.6);
    // group3.position.set(-0.4, 0, 1);
    // this.scene.add(group3);
    // const group4 = group.clone();
    // group4.position.set(-2, 0, 1);
    // group4.rotateY(0.8);
    // this.scene.add(group4);
  }
}

export default Cube;

export interface ICube {
  id: string;
  type: string;
  position: IPos;
  color: IColor;
  width: number;
  height: number;
  length: number;
}
