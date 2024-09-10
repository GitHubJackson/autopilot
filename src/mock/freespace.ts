import { IArrow } from "../renderer/arrow";
import { ICube } from "../renderer/cube";
import { IFreespace } from "../renderer/freespace";
import { IPolygonCylinder } from "../renderer/polygonCylinder";

export const freespaceData1: IFreespace = {
  id: "freespace-0",
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  contour: [
    { x: -1, y: -30, z: 0 },
    { x: -1, y: 10, z: 0 },
    { x: 0.6, y: 10, z: 0 },
    { x: 0.6, y: -30, z: 0 },
  ],
  // 洞可能有多个，所以这里应该设置成二维数组
  // holes: [
  //   [
  //     { x: 0.2, y: 0.8, z: 0 },
  //     { x: 0.5, y: 0.7, z: 0 },
  //     { x: 0.5, y: 2, z: 0 },
  //     { x: 0.2, y: 2, z: 0 },
  //   ],
  // ],
  color: {
    r: 58,
    g: 58,
    b: 58,
  },
};

export const freespaceData2: IFreespace = {
  id: "freespace-1",
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  contour: [
    { x: 10, y: -3, z: 0 },
    { x: 10, y: -1, z: 0 },
    { x: -10, y: -1, z: 0 },
    { x: -10, y: -3, z: 0 },
  ],
  color: {
    r: 58,
    g: 58,
    b: 58,
  },
};

export const cubeData1: ICube = {
  id: "cube1",
  type: "BUS",
  position: {
    x: 0,
    y: -2,
    z: 0.21,
  },
  color: {
    r: 0,
    g: 1,
    b: 0,
  },
  width: 0.4,
  height: 0.4,
  length: 1,
};

export const textData1 = {
  id: "text1",
  content: "text1",
  size: 0.2,
  color: {
    r: 0,
    g: 0,
    b: 1,
  },
  position: {
    x: 0,
    y: -2,
    z: 0.5,
  },
};

export const arrowData1: IArrow = {
  id: "text1",
  origin: { x: 0, y: 1, z: 0 },
  endPoint: { x: 0, y: 1, z: 0 },
};

export const polygonCylinderData1: IPolygonCylinder = {
  id: "polygonCylinderData1",
  contour: [
    { x: 0.6, y: -0.4, z: 0 },
    { x: 0.6, y: -0.8, z: 0 },
    { x: 0.4, y: -0.8, z: 0 },
    { x: 0.2, y: -0.6, z: 0 },
    { x: 0.4, y: -0.4, z: 0 },
  ],
  height: 0.16,
  color: {
    r: 1,
    g: 0,
    b: 0,
  },
};

export const polygonCylinderData2: IPolygonCylinder = {
  id: "polygonCylinderData2",
  contour: [
    { x: -0.6, y: 0, z: -1.4 },
    { x: -0.6, y: 0, z: -1.8 },
    { x: -0.8, y: 0, z: -1.8 },
    { x: -0.8, y: 0, z: -1.4 },
  ],
  height: 0.16,
  color: {
    r: 0,
    g: 1,
    b: 0,
  },
};

export const polygonCylinderData3: IPolygonCylinder = {
  id: "polygonCylinderData3",
  contour: [
    { x: -0.8, y: 0, z: -0.7 },
    { x: -0.8, y: 0, z: -0.8 },
    { x: -0.9, y: 0, z: -0.8 },
    { x: -0.9, y: 0, z: -0.7 },
  ],
  height: 0.2,
  color: {
    r: 0,
    g: 0,
    b: 1,
  },
};

export const polygonCylinderData4: IPolygonCylinder = {
  id: "polygonCylinderData4",
  contour: [
    { x: -0.6, y: 0, z: -0.7 },
    { x: -0.6, y: 0, z: -0.8 },
    { x: -0.7, y: 0, z: -0.8 },
    { x: -0.7, y: 0, z: -0.7 },
  ],
  height: 0.2,
  color: {
    r: 0,
    g: 0,
    b: 1,
  },
};
