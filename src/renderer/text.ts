import * as THREE from "three";
import { IColor, IPos } from "../types/common";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let font: any = null;
const fontLoader = new FontLoader();
fontLoader.load("gentilis_regular.typeface.json", (res) => {
  font = res;
});

export function renderTextMesh(data: IText) {
  const { content, color = { r: 1, g: 1, b: 1 }, position, size = 0.1 } = data;
  const textGeo = new TextGeometry(content, {
    font,
    size,
    depth: 0.01,
  });
  textGeo.computeBoundingBox();
  const material = new THREE.MeshPhongMaterial();
  material.color.setRGB(color.r, color.g, color.b);
  const centerOffset =
    -position.x * (textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x);
  const textMesh = new THREE.Mesh(textGeo, material);
  textMesh.position.set(centerOffset, position.y, position.z || 0);
  textMesh.rotation.x = 0;
  textMesh.rotation.y = Math.PI * 2;
  return textMesh;
}

class Text {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene = new THREE.Scene();

  constructor(scene?: THREE.Scene) {
    if (scene) {
      this.scene = scene;
    }
  }

  draw(data: IText) {
    const textMesh = renderTextMesh(data);
    this.scene.add(textMesh);
  }
}

export default Text;

export interface IText {
  id: string;
  // 字体大小
  position: IPos;
  content: string;
  size?: number;
  color?: IColor;
}
