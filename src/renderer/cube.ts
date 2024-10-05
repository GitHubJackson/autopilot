/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from "three";
import { IColor, IPos } from "../types/common";
import crateGif from "@/assets/textures/crate.gif";
import { renderTextMesh } from "./text";
import { drawArrow } from "./arrow";
import { loadTexture } from "../helper";

type TextCache = Record<string, THREE.Mesh>;

class Cube {
  scene = new THREE.Scene();
  camera = new THREE.Camera();
  textCache: TextCache = {};
  cubes: THREE.Group[] = [];
  // id和cube映射
  cubeMap = {};

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.triggerLabelBox = this.triggerLabelBox.bind(this);
    this.updateLabelBox = this.updateLabelBox.bind(this);
  }

  draw(datas: ICube[]) {
    datas.forEach((data) => {
      const { id, type, position, color, width, height, length } = data;
      const group = new THREE.Group();
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.2,
      });
      material.color.setRGB(color.r, color.g, color.b);
      const geometry = new THREE.BoxGeometry(width, height, length);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotateX(Math.PI / 2);
      mesh.rotateY(Math.PI / 2);
      group.add(mesh);
      const edges = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial();
      edgesMaterial.color.setRGB(color.r, color.g, color.b);
      const line = new THREE.LineSegments(edges, edgesMaterial);
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      group.add(line);
      // 绘制顶部文字
      const text = id + "-" + type;
      if (this.textCache[text]) {
        const textMesh = this.textCache[text];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mesh.textMesh = textMesh;
        group.add(textMesh);
      } else {
        const textMesh = renderTextMesh({
          id: text,
          content: text,
          position: {
            x: mesh.position.x,
            y: mesh.position.y + width / 2,
            z: mesh.position.z + height / 2 + 0.03,
          },
        });
        // 挂载到他车Mesh上
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mesh.textMesh = textMesh;
        group.add(textMesh);
      }
      // 绘制朝向箭头
      const arrowMesh = drawArrow({
        id: data.id + "-" + "arrow",
        endPoint: {
          x: mesh.position.x + length * 1.5,
          y: mesh.position.y,
          z: mesh.position.z,
        },
        origin: {
          x: mesh.position.x,
          y: mesh.position.y,
          z: mesh.position.z,
        },
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mesh.arrowMesh = arrowMesh;
      group.add(arrowMesh);
      group.userData.id = data.id;
      group.userData.type = data.type;
      group.userData.width = data.width;
      group.userData.height = data.height;
      group.position.set(position.x, position.y, position.z ?? 0);
      this.scene.add(group);
      this.cubes.push(group);
    });
    this.triggerLabelBox();
    // MOCK
    setInterval(() => {
      this.updateLabelBox();
    }, 100);
    return this.cubes;
  }

  update() {
    // 更新位置信息时需要同步更新下标签文本
  }

  triggerLabelBox() {
    // @ts-ignore
    const canvasContainer = window.canvasRef.container!;
    this.cubes.forEach((cube) => {
      const dom = document.getElementById(`cube-label-${cube.id}`);
      if (!dom) {
        const newBox = document.createElement("div");
        newBox.setAttribute("id", `cube-label-${cube.id}`);
        newBox.setAttribute("class", "label-box");
        canvasContainer.appendChild(newBox);
        this.updateLabelBox();
      } else {
        dom.style.display = "block";
        this.updateLabelBox();
      }
    });
  }

  updateLabelBox() {
    // @ts-ignore
    const canvasRef = window.canvasRef;
    this.cubes.forEach((cube) => {
      const dom = document.getElementById(`cube-label-${cube.id}`);
      if (dom) {
        const x = cube.position.x;
        const y = cube.position.y;
        const vector = new THREE.Vector3(x, y, 0.1);
        // 将世界坐标转为标准设备坐标
        vector.project(this.camera);
        const w = canvasRef.width / 2;
        const h = canvasRef.height / 2;
        const screenX = Math.round(vector.x * w + w);
        const screenY = Math.round(-vector.y * h + h);
        dom.innerText = `${cube.userData.id}-${cube.userData.type}\nsize:[1.3,2.4,1.2]`;
        dom.style.transform = `translate(${screenX}px,${screenY}px)`;
      }
    });
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
