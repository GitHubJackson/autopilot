/* eslint-disable @typescript-eslint/ban-ts-comment */
import Konva from "konva";
import { makeObservable, observable, action } from "mobx";
import { createCircle, createRect } from "../renderer";
import {
  EditMode,
  EMapElement,
  ESceneElement,
  IAutoCar,
  IMapElements,
  ISceneData,
  ISceneElements,
} from "./type";
import { ELineType, ILine } from "../../../renderer/line";
import _ from "lodash";
import { IFreespace } from "../../../renderer/freespace";

class EditorStore {
  stage: IStage = {
    ref: null,
  };
  autoCar: IAutoCar = {
    ref: null,
    path: [],
    pathLine: null,
    speed: 0,
  };
  // 当前地图偏移值
  offset = { x: 0, y: 0 };
  focusOrigin = () => {
    if (this.stage.ref) {
      // 清除拖拽产生的位移
      this.stage.ref.x(0);
      this.stage.ref.y(0);
      // // 设置缩放比例为5倍
      // const scale = 5;
      // this.stage.ref.scale({ x: scale, y: scale });
      // 计算缩放后的中心偏移量（需除以缩放比例）
      const centerX = -this.stage.ref.width() / 2;
      const centerY = -this.stage.ref.height() / 2;
      this.offset = { x: centerX, y: centerY };
      this.stage.ref.offset(this.offset);
    }
  };
  editMode = EditMode.Map;
  isEdit = false;
  isDrawMapElement: EMapElement | null = null;
  // 车道辅助绘制
  drawLaneCount = 0;
  // 当前车道
  currentLane: Konva.Shape | null = null;
  // 当前正在绘制的场景元素
  isDrawSceneElement: ESceneElement | null = null;
  // 绘制结束的钩子，在这里保存数据
  drawDone = (type: EMapElement | ESceneElement) => {
    const layer = this.stage.ref!.getLayers()[0];
    if (type === EMapElement.Line) {
      const data: ILine = {
        points: _.chunk(this.currentLine!.points(), 2),
        width: 1,
        type: ELineType.Solid,
      };
      this.mapElements.lines.push(data);
      this.isDrawMapElement = null;
      this.currentLine = null;
    } else if (type === EMapElement.Lane) {
      const contour = _.chunk(this.currentLane?.getAttr("points"), 2).map(
        (item) =>
          ({
            x: item[0],
            y: item[1],
            z: 0,
          } as { x: number; y: number; z: number })
      );
      const data: IFreespace = {
        id: "freespace" + this.mapElements.lanes.length,
        contour,
      };
      this.mapElements.lanes.push(data);
      this.currentLine?.destroy();
      this.currentLane = null;
      this.currentLine = null;
      this.drawLaneCount = 0;
    } else if (type === ESceneElement.Vehicle) {
      this.isDrawSceneElement = null;
    } else if (type === ESceneElement.Path) {
      if (this.selectedElement?.name() === "autoCar") {
        this.autoCar.pathLine = this.currentLine;
      } else if (this.selectedElement?.getAttr("vehicleType") === "CAR") {
        // TODO 有点绕
        this.selectedElement.getAttr("userData").path = _.chunk(
          this.currentLine?.points(),
          2
        );
      }
      this.currentLine = null;
      this.isDrawSceneElement = null;
    }
    layer.batchDraw();
    this.isEdit = false;
  };
  drawCallForScene = (type: ESceneElement) => {
    this.isEdit = true;
    switch (type) {
      case ESceneElement.Vehicle: {
        this.isDrawSceneElement = ESceneElement.Vehicle;
        break;
      }
      case ESceneElement.Path: {
        this.isDrawSceneElement = ESceneElement.Path;
        break;
      }
      default: {
        break;
      }
    }
  };
  drawCallForMap = (type: EMapElement) => {
    this.isEdit = true;
    switch (type) {
      case EMapElement.Line: {
        this.isDrawMapElement = EMapElement.Line;
        break;
      }
      case EMapElement.Lane: {
        this.isDrawMapElement = EMapElement.Lane;
        break;
      }
      default: {
        break;
      }
    }
    this.isEdit = false;
  };
  transformer: Konva.Transformer | null = null;
  currentLine: Konva.Line | null = null;
  initStage = () => {
    const stage = this.stage.ref!;
    const layer = stage.getLayers()[0];
    // 绘制原点
    const origin = createCircle({
      fill: "red",
      radius: 4,
      x: 0,
      y: 0,
      strokeWidth: 1,
    });
    layer.add(origin);
    // 绘制自车
    const autoCar = createRect({
      name: "autoCar",
      fill: "green",
      x: 0,
      y: 0,
      width: 30,
      height: 20,
      offsetX: 15,
      offsetY: 10,
      strokeWidth: 1,
    });
    autoCar.setAttr("speed", 0.8);
    layer.add(autoCar);
    this.autoCar.ref = autoCar;
    this.focusOrigin();
    // 初始化元素控制器
    this.transformer = new Konva.Transformer({
      rotateEnabled: true, // 启用旋转
      rotationSnaps: [0, 90, 180, 270], // 设置旋转吸附角度
    });
    stage.batchDraw();
    layer.add(this.transformer);
    stage.on("mousedown", () => {
      const pos = stage.getPointerPosition()!;
      // TODO 这个偏移量每次都要计算...有点别扭，估计是我用法不对
      const pointX = stage.offset().x + pos.x;
      const pointY = stage.offset().y + pos.y;
      if (this.isDrawMapElement === EMapElement.Line) {
        if (!this.currentLine) {
          this.currentLine = new Konva.Line({
            points: [pointX, pointY],
            fill: "yellow",
            stroke: "yellow",
            strokeWidth: 2,
          });
        } else {
          this.currentLine.points().push(pointX, pointY);
        }
        layer.add(this.currentLine);
      } else if (this.isDrawMapElement === EMapElement.Lane) {
        if (this.drawLaneCount === 0) {
          this.currentLine = new Konva.Line({
            points: [pointX, pointY],
            fill: "yellow",
            stroke: "yellow",
            strokeWidth: 2,
          });
          layer.add(this.currentLine);
        } else if (this.drawLaneCount === 1) {
          this.currentLine!.points().push(pointX, pointY);
        } else if (this.drawLaneCount === 2) {
          this.currentLane?.destroy();
          const points = [
            this.currentLine!.points()[0],
            this.currentLine!.points()[1],
            this.currentLine!.points()[2],
            this.currentLine!.points()[3],
            pointX,
            pointY,
            pointX -
              (this.currentLine!.points()[2] - this.currentLine!.points()[0]),
            pointY -
              (this.currentLine!.points()[3] - this.currentLine!.points()[1]),
          ];
          this.currentLane = new Konva.Shape({
            // 顶点坐标数组
            points,
            fill: "yellow",
            stroke: "green",
            opacity: 0.2,
            strokeWidth: 2,
            sceneFunc: function (ctx, shape) {
              const points = shape.getAttr("points");
              ctx.beginPath();
              ctx.moveTo(points[0], points[1]);
              for (let i = 2; i < points.length; i += 2) {
                ctx.lineTo(points[i], points[i + 1]);
              }
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            },
          });
          layer.add(this.currentLane);
          this.drawDone(EMapElement.Lane);
        }
        this.drawLaneCount++;
      } else if (this.isDrawSceneElement === ESceneElement.Path) {
        if (!this.currentLine) {
          this.currentLine = new Konva.Line({
            points: [this.selectedElement!.x(), this.selectedElement!.y()],
            fill: "#fff",
            stroke: "#fff",
            strokeWidth: 1,
          });
        } else {
          this.currentLine.points().push(pointX, pointY);
        }
        layer.add(this.currentLine);
      }
    });
    stage.on("mousemove", () => {
      if (this.currentLine && this.isDrawMapElement === EMapElement.Line) {
        const pos = stage.getPointerPosition()!;
        const pointX = stage.offset().x + pos.x;
        const pointY = stage.offset().y + pos.y;
        let newPoints = [];
        if (this.currentLine.points().length > 2) {
          newPoints = this.currentLine
            .points()
            .slice(0, -2)
            .concat([pointX, pointY]);
        } else {
          newPoints = this.currentLine.points().concat([pointX, pointY]);
        }
        this.currentLine.points(newPoints);
        layer.batchDraw();
      }
      if (this.currentLine && this.isDrawMapElement === EMapElement.Lane) {
        const pos = stage.getPointerPosition()!;
        const pointX = stage.offset().x + pos.x;
        const pointY = stage.offset().y + pos.y;
        let newPoints = [];
        if (this.drawLaneCount === 1) {
          if (this.currentLine.points().length > 2) {
            newPoints = this.currentLine
              .points()
              .slice(0, -2)
              .concat([pointX, pointY]);
          } else {
            newPoints = this.currentLine.points().concat([pointX, pointY]);
          }
          this.currentLine.points(newPoints);
          layer.batchDraw();
        } else if (this.drawLaneCount === 2) {
          this.currentLane?.destroy();
          const points = [
            this.currentLine!.points()[0],
            this.currentLine!.points()[1],
            this.currentLine!.points()[2],
            this.currentLine!.points()[3],
            pointX,
            pointY,
            pointX -
              (this.currentLine!.points()[2] - this.currentLine!.points()[0]),
            pointY -
              (this.currentLine!.points()[3] - this.currentLine!.points()[1]),
          ];
          this.currentLane = new Konva.Shape({
            points,
            fill: "yellow",
            stroke: "green",
            opacity: 0.2,
            strokeWidth: 2,
            sceneFunc: function (ctx, shape) {
              const points = shape.getAttr("points");
              ctx.beginPath();
              ctx.moveTo(points[0], points[1]);
              for (let i = 2; i < points.length; i += 2) {
                ctx.lineTo(points[i], points[i + 1]);
              }
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            },
          });
          layer.add(this.currentLane);
        }
      }
      if (this.currentLine && this.isDrawSceneElement === ESceneElement.Path) {
        const pos = stage.getPointerPosition()!;
        const pointX = stage.offset().x + pos.x;
        const pointY = stage.offset().y + pos.y;
        let newPoints = [];
        if (this.currentLine.points().length > 2) {
          newPoints = this.currentLine
            .points()
            .slice(0, -2)
            .concat([pointX, pointY]);
        } else {
          newPoints = this.currentLine.points().concat([pointX, pointY]);
        }
        this.currentLine.points(newPoints);
        layer.batchDraw();
      }
    });
    stage.on("click", (e) => {
      if (e.target === stage) {
        if (this.isDrawSceneElement === ESceneElement.Path) {
          return;
        }
        this.transformer!.nodes([]);
        this.selectedElement = null;
        if (this.isDrawSceneElement === ESceneElement.Vehicle) {
          const pos = stage.getPointerPosition()!;
          const pointX = stage.offset().x + pos.x;
          const pointY = stage.offset().y + pos.y;
          const vehicle = createRect({
            name: "vehicle" + this.sceneElements.vehicles.length,
            fill: "blue",
            x: pointX,
            y: pointY,
            width: 30,
            height: 20,
            strokeWidth: 1,
            offsetX: 15,
            offsetY: 10,
          });
          layer.add(vehicle);
          vehicle.setAttr("speed", 0.8);
          vehicle.setAttr("type", "CAR");
          const vehicleObj = {
            id: "vehicle" + this.sceneElements.vehicles.length,
            // TODO not work hear
            type: "CAR",
            position: {
              x: vehicle.x(),
              y: vehicle.y(),
              z: 0,
            },
            color: {
              r: 0,
              g: 0,
              b: 1,
            },
            width: vehicle.width(),
            length: vehicle.height(),
            height: 2,
            speed: vehicle.getAttr("speed"),
            path: [],
          };
          this.sceneElements.vehicles.push(vehicleObj);
          this.drawDone(ESceneElement.Vehicle);
          // 自动聚焦
          this.transformer!.nodes([vehicle]);
          vehicle.setAttr("userData", vehicleObj);
          vehicle.setAttr("vehicleType", "CAR");
          this.selectedElement = vehicle;
          this.isDrawSceneElement = null;
        }
      } else {
        const target = e.target as Konva.Shape;
        if (target !== this.currentLine) {
          this.transformer!.nodes([target]);
          this.selectedElement = target;
        }
      }
    });
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "q") {
        if (this.isDrawMapElement === EMapElement.Line && this.currentLine) {
          const newPoints = this.currentLine.points().slice(0, -2);
          this.currentLine.points(newPoints);
          this.drawDone(EMapElement.Line);
        } else if (
          this.isDrawSceneElement === ESceneElement.Path &&
          this.currentLine
        ) {
          const newPoints = this.currentLine.points().slice(0, -2);
          this.currentLine.points(newPoints);
          this.drawDone(ESceneElement.Path);
        }
      }
    };
    window.addEventListener("keydown", onKeydown);
  };
  // 地图
  mapElements: IMapElements = {
    lines: [],
    lanes: [],
  };
  currentMap = "";
  // 场景
  sceneElements: ISceneElements = {
    vehicles: [],
    obstacles: [],
  };
  currentScene = "";
  // 元素
  selectedElement: Konva.Shape | null = null;
  // 当前选中的元素的属性，基础属性包括位置、颜色、旋转、大小、名称等，直接挂载到selectedElement
  // selectedElementProps: any = null;

  saveFile = () => {
    // TODO 坐标系还有点问题，需要翻转y轴坐标
    const data: ISceneData = {
      autoCar: {
        pos: [this.autoCar.ref!.x(), -this.autoCar.ref!.y()],
        rotation: this.autoCar.ref!.rotation(),
        path: _.chunk(this.autoCar.pathLine?.points(), 2).map((item) => [
          item[0],
          -item[1],
        ]),
        speed: this.autoCar.ref?.getAttr("speed") || 0.5,
      },
      map: {
        lines: this.mapElements.lines.map((item) => {
          const points = item.points.map((point) => {
            return [point[0], -point[1]];
          });
          return {
            ...item,
            points,
          };
        }),
        lanes: this.mapElements.lanes.map((item) => {
          const contour = item.contour.map((point) => {
            return {
              x: point.x,
              y: -point.y,
              z: point.z,
            };
          });
          return {
            ...item,
            contour,
          };
        }),
      },
      scene: {
        vehicles: this.sceneElements.vehicles.map((item) => {
          return {
            ...item,
            position: {
              x: item.position.x,
              y: -item.position.y,
              z: item.position.z,
            },
            path: item.path.map((item) => [item[0], -item[1]]) ?? [],
          };
        }),
        obstacles: this.sceneElements.obstacles,
      },
    };
    console.log("===saveFile===", data);
    localStorage.setItem("sceneData", JSON.stringify(data));
  };

  constructor() {
    makeObservable(this, {
      stage: observable.shallow,
      editMode: observable,
      isEdit: observable,
      currentMap: observable,
      currentScene: observable,
      selectedElement: observable,
      drawCallForScene: action,
      drawCallForMap: action,
      initStage: action,
    });
  }
}

export const editorStore = new EditorStore();

interface IStage {
  ref: Konva.Stage | null;
}
