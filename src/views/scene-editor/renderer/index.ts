import Konva from "konva";
import { createShape } from "./base";

export function createRect(config: Konva.RectConfig) {
  return createShape("rect", {
    width: 100,
    height: 80,
    // cornerRadius: 5, // 圆角支持
    ...config,
  });
}

export function createCircle(config: Konva.CircleConfig) {
  return createShape("circle", {
    radius: config?.radius || 50,
    ...config,
  });
}

export function createTriangle(config: Konva.ShapeConfig) {
  return createShape("triangle", {
    offset: { x: 0, y: -15 }, // 居中调整
    ...config,
  });
}

export function createLine(points: number[], config: Konva.LineConfig) {
  return createShape("line", {
    points,
    dash: config?.dashed ? [10, 5] : null, // 虚线支持
    ...config,
  });
}

// TODO: 多边形支持
// export function createPolygon(sides = 5, config: Konva.RegularPolygonConfig) {
//   return createShape("polygon", {
//     sides,
//     radius: sides * 10, // 动态计算半径
//     ...config,
//   });
// }

// TODO: 组合图形支持
// function createCompositeShape() {
//   const group = new Konva.Group({ draggable: true });
//   group.add(createRect({ width: 200, height: 120 }));
//   group.add(createLine([20,60, 180,60], { stroke: '#FFF' }));
//   return group;
// }

// TODO: 动画支持
// function createAnimatedCircle() {
//   const circle = createCircle();
//   new Konva.Tween({
//     node: circle,
//     duration: 2,
//     scaleX: 1.2,
//     scaleY: 1.2,
//     easing: Konva.Easings.EaseInOut,
//     yoyo: true
//   }).play();
//   return circle;
// }
