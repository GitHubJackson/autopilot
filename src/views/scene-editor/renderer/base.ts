import Konva from "konva";

type ShapeType = "rect" | "circle" | "line" | "polygon" | "triangle";

/**
 * 图形基类封装
 * @param {string} type 图形类型
 * @param {Object} config 配置参数
 */
export function createShape(type: ShapeType, config: any) {
  const defaults = {
    x: 0,
    y: 0,
    fill: Konva.Util.getRandomColor(),
    draggable: true,
    stroke: "#333",
    strokeWidth: 2,
  };

  const shapeConfig = { ...defaults, ...config };
  let shape: Konva.Shape;

  switch (type) {
    case "rect":
      shape = new Konva.Rect(shapeConfig);
      break;
    case "circle":
      shape = new Konva.Circle({
        radius: 50,
        ...shapeConfig,
      });
      break;
    case "line":
      shape = new Konva.Line({
        points: [0, 0, 100, 100], // 默认对角线
        lineCap: "round",
        ...shapeConfig,
      });
      break;
    case "polygon":
      shape = new Konva.RegularPolygon({
        sides: 5, // 默认五边形
        radius: 60,
        ...shapeConfig,
      });
      break;
    case "triangle":
      shape = new Konva.Shape({
        sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
          context.beginPath();
          context.moveTo(0, -30);
          context.lineTo(30, 30);
          context.lineTo(-30, 30);
          context.closePath();
          context.fillStrokeShape(shape);
        },
        ...shapeConfig,
      });
      break;
  }

  // 添加通用事件处理[8](@ref)
  shape!.on("click", () => console.log(`${type} clicked`));
  shape!.on("dragend", () => console.log(`${type} moved`));

  return shape!;
}
