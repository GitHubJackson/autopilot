import { IFreespace } from "../renderer/freespace";

export const freespaceData1: IFreespace = {
  id: "freespace-0",
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  contour: [
    { x: -1, y: -5 },
    { x: -1, y: 10 },
    { x: 0.6, y: 10 },
    { x: 0.6, y: -5 },
  ],
  // 洞可能有多个，所以这里应该设置成二维数组
  holes: [
    [
      { x: 0.2, y: 0.8 },
      { x: 0.5, y: 0.7 },
      { x: 0.5, y: 2 },
      { x: 0.2, y: 2 },
    ],
  ],
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
    { x: -10, y: 1 },
    { x: -10, y: 4 },
    { x: 10, y: 1 },
    { x: 10, y: 4 },
  ],
  color: {
    r: 58,
    g: 58,
    b: 58,
  },
};
