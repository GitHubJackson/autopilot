import { ELineType, ILine } from "../renderer/line";

export const lineData1: ILine = {
  width: 0.02,
  type: ELineType.Solid,
  points: [
    [0.4, -20, 0],
    [0.4, 20, 0],
  ],
};
export const lineData2: ILine = {
  width: 0.02,
  type: ELineType.Solid,
  points: [
    [-0.8, -20, 0],
    [-0.8, 20, 0],
  ],
};

export const lineData3: ILine = {
  width: 0.02,
  type: ELineType.Dash,
  points: [
    [-0.2, -20, 0],
    [-0.2, -10, 0],
    [-0.2, 0, 0],
    [-0.2, 10, 0],
    [-0.2, 20, 0],
  ],
};

export const lineData4: ILine = {
  width: 0.3,
  type: ELineType.Gradual,
  color: "#ffff00",
  endColor: "orange",
  points: [
    [0, 0, 0],
    [0, -2, 0],
    [-0.2, -4, 0],
    [-0.5, -5, 0],
    [-0.6, -6, 0],
    [-0.6, -8, 0],
    [-0.6, -10, 0],
  ],
};
