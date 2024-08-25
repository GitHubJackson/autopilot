import * as THREE from "three";
import { IColor, IPos } from "../types/common";

class Freespace {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  draw(data: IFreespace) {
    const {
      contour,
      holes = [],
      color = { r: 0, g: 0, b: 0 },
      position,
    } = data;
    if (contour.length < 3) {
      return;
    }
    const shape = new THREE.Shape();
    // 先绘制轮廓
    // 设置起点
    shape.moveTo(contour[0].x, contour[0].y);
    contour.forEach((item) => shape.lineTo(item.x, item.y));
    // 绘制洞
    holes.forEach((item) => {
      if (item.length < 3) {
        return;
      }
      const path = new THREE.Path();
      path.moveTo(item[0].x, item[0].y);
      item.forEach((subItem) => {
        path.lineTo(subItem.x, subItem.y);
      });
      shape.holes.push(path);
    });
    const shapeGeometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshPhongMaterial();
    // setRGB传参颜色值需要介于0-1之间
    material.color.setRGB(color.r / 255, color.g / 255, color.b / 255);
    material.opacity = color.a || 1;
    const mesh = new THREE.Mesh(shapeGeometry, material);
    mesh.position.set(position.x, position.y, position.z || 0);
    mesh.rotateX(-Math.PI / 2);
    this.scene.add(mesh);
  }
}

export default Freespace;

export interface IFreespace {
  // 一般可以用于判断元素是否可复用
  id: string;
  position: IPos;
  contour: IPos[];
  // 洞可能有多个，所以这里应该设置成二维数组
  holes?: IPos[][];
  color?: IColor;
}
