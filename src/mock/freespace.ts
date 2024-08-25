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
    { x: 1, y: 10 },
    { x: 1, y: -5 },
  ],
  // 洞可能有多个，所以这里应该设置成二维数组
  holes: [
    [
      { x: 0.5, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 0.5, y: 2 },
    ],
  ],
  color: {
    r: 58,
    g: 58,
    b: 58,
  },
};
