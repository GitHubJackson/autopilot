import * as THREE from "three";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const getNormals = require("polyline-normals");

// 获取绝对距离，用于虚线和渐变线的实现
function getPointsDistance(pt1: number[], pt2: number[]) {
  return Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
}

class Line {
  scene = new THREE.Scene();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createGeometry(data: ILine, needDistance: boolean = false) {
    const { points } = data;
    const vertices: number[][] = [];
    const indices: number[] = [];
    const lineNormal: number[][] = [];
    const lineMiter: number[][] = [];
    const lineDistance: number[][] = [];
    const lineAllDistance: number[][] = [];
    // const uv: number[][] = [];
    const geometry = new THREE.BufferGeometry();
    // 计算各个点的法向量
    const normalsByPolyline = getNormals(points);
    let indicesIdx = 0;
    let index = 0;
    let distance = 0;
    points.forEach((point, i, list) => {
      const idx = index;
      if (i !== points.length - 1) {
        // 添加索引以形成两个三角形
        indices[indicesIdx++] = idx + 0;
        indices[indicesIdx++] = idx + 1;
        indices[indicesIdx++] = idx + 2;
        indices[indicesIdx++] = idx + 2;
        indices[indicesIdx++] = idx + 1;
        indices[indicesIdx++] = idx + 3;
      }
      // 这里不用先计算，后面直接在shader里面借助GPU计算就行
      vertices.push(point);
      // uv.push([1, 0]);
      vertices.push(point);
      // uv.push([1, 0]);
      index = index + 2;
      if (needDistance) {
        let d = 0;
        if (i > 0) {
          d = getPointsDistance(
            [point[0], point[1]],
            [list[i - 1][0], list[i - 1][1]]
          );
        }
        distance += d;
        lineDistance.push([distance], [distance]);
      }
    });
    normalsByPolyline.forEach((item: any) => {
      const norm = item[0];
      const miter = item[1];
      lineNormal.push([norm[0], norm[1]], [norm[0], norm[1]]);
      lineMiter.push([-miter], [miter]);
    });
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices.flat(), 3)
    );
    geometry.setAttribute(
      "lineNormal",
      new THREE.Float32BufferAttribute(lineNormal.flat(), 2)
    );
    geometry.setAttribute(
      "lineMiter",
      new THREE.Float32BufferAttribute(lineMiter.flat(), 1)
    );
    geometry.setIndex(new THREE.Uint16BufferAttribute(indices, 1));
    // geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv.flat(), 2));
    if (needDistance) {
      geometry.setAttribute(
        "lineDistance",
        new THREE.Float32BufferAttribute(lineDistance.flat(), 1)
      );
      lineDistance.forEach(() => {
        lineAllDistance.push([distance]);
      });
      geometry.setAttribute(
        "lineAllDistance",
        new THREE.Float32BufferAttribute(lineAllDistance.flat(), 1)
      );
    }
    return geometry;
  }

  draw(data: ILine) {
    const { color = "#ffffff", width, type, endColor } = data;
    let geometry;
    let shader;
    switch (type) {
      case ELineType.Solid: {
        geometry = this.createGeometry(data);
        shader = getSolidLineShader({
          width: width ?? 0.01,
          color: color,
        });
        break;
      }
      case ELineType.Dash: {
        geometry = this.createGeometry(data, true);
        shader = getDashedLineShader({
          width: width ?? 0.01,
          color: color,
        });
        break;
      }
      case ELineType.Gradual: {
        geometry = this.createGeometry(data, true);
        shader = getGradientLineShader({
          width: width ?? 0.01,
          color: color,
          endColor: endColor,
        });
        break;
      }
      default:
        break;
    }
    const plane = new THREE.Mesh(geometry, shader);
    plane.position.z = 0.01;
    this.scene.add(plane);
  }
}

export default Line;

export interface ILine {
  points: number[][]; // 点集
  width: number;
  type: ELineType; // 默认是实线
  color?: string;
  endColor?: string; // 渐变色，作为终点颜色，color是起点颜色
  opacity?: number;
  dashInfo?: {
    // 实线长度
    solidLength?: number;
    // 虚线长度
    dashLength?: number;
  };
}
// export interface ILinePoint {
//   pos: IPos;
// }
export enum ELineType {
  Solid = 0, // 实线
  Dash = 1, // 虚线
  Gradual = 10, // 渐变线
}

export function getSolidLineShader(option: {
  width?: number;
  opacity?: number;
  color?: string;
}) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      thickness: { value: option.width ?? 0.1 },
      opacity: { value: option.opacity ?? 1.0 },
      diffuse: {
        value: option.color
          ? new THREE.Color(option.color)
          : new THREE.Color("#ffffff"),
      },
    },
    vertexShader: `
      uniform float thickness;
      attribute float lineMiter;
      attribute vec2 lineNormal;
      void main() { 
        // 沿着法线方向计算线段中点对应的两个顶点
        vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 diffuse;
      uniform float opacity;
      void main() {
        gl_FragColor = vec4(diffuse, opacity);
      }
    `,
  });
  material.transparent = true;
  material.side = THREE.BackSide;
  return material;
}

// 用于画单色虚线
export function getDashedLineShader(option: any = {}) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      thickness: { value: option.width ?? 0.1 },
      opacity: { value: option.opacity ?? 1.0 },
      diffuse: { value: new THREE.Color(option.color) },
      // 虚线部分的长度
      dashLength: { value: option?.dashInfo?.dashLength ?? 1.0 },
      // 实线部分的长度
      solidLength: { value: option?.dashInfo?.solidLength ?? 2.0 },
    },
    vertexShader: `
      uniform float thickness;
      attribute float lineMiter;
      attribute vec2 lineNormal;
      attribute float lineDistance;
      varying float lineU;

      void main() { 
        // 累积距离
        lineU = lineDistance;
        vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
      }
    `,
    fragmentShader: `
      varying float lineU;
      uniform vec3 diffuse;
      uniform float opacity;
      uniform float dashLength;
      uniform float solidLength;

      void main() {
        // 取模,
        float lineUMod = mod(lineU, dashLength + solidLength); 
        // lineUMod>solidLength则返回0.0,说明在实线区域;否则返回1.0,说明在虚线区域
        float dash = 1.0 - step(solidLength, lineUMod);
        gl_FragColor = vec4(diffuse * vec3(dash), opacity * dash); 
      }
    `,
  });
  material.transparent = true;
  material.side = THREE.BackSide;
  return material;
}

// 渐变色
export function getGradientLineShader(option: any = {}) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      thickness: { value: option.width ?? 0.1 },
      opacity: { value: option.opacity ?? 1.0 },
      diffuse: { value: new THREE.Color(option.color) },
      endColor: { value: new THREE.Color(option.endColor) },
    },
    vertexShader: `
      uniform float thickness;
      attribute vec2 lineNormal;
      attribute float lineMiter;
      attribute float lineDistance;
      attribute float lineAllDistance;
      varying float lineU;
      varying float lineAll;

      void main() { 
        lineU = lineDistance;
        lineAll = lineAllDistance;
        vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
      }
    `,
    fragmentShader: `
      // 累积长度
      varying float lineU;
      varying float lineAll;
      uniform float opacity;
      uniform vec3 diffuse; 
      uniform vec3 endColor; 

      void main() {
        vec3 aColor = (1.0-lineU/lineAll)*(diffuse-endColor)+endColor;
        gl_FragColor =vec4(aColor, opacity);  
      }
    `,
  });
  material.transparent = true;
  material.side = THREE.DoubleSide;
  return material;
}
