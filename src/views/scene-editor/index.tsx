import React, { useState, useRef, useEffect } from "react";
import Konva from "konva";
import "./index.css";
import {
  createCircle,
  createLine,
  createRect,
  createTriangle,
} from "./renderer";
import { Header } from "./components/header";
import { RightSider } from "./components/right-sider";
import { observer } from "mobx-react-lite";
import { editorStore } from "./store";
import { Overlay } from "./components/overlay";

const MIN_SCALE = 0.5; // 最小缩放比例
const MAX_SCALE = 5; // 最大缩放比例

const SceneEditor = observer(() => {
  const { stage } = editorStore;
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<Konva.ShapeConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

  // TODO 地图和元素分层

  const mock = () => {
    const layer = stage.ref!.getLayers()[0];
    // 创建图形
    const shapes = [
      createRect({ x: 100, y: 100, fill: "#FF6B6B" }),
      createCircle({ x: 300, y: 150, strokeWidth: 4 }),
      createTriangle({ x: 700, y: 180, rotation: 45 }),
      createLine([50, 400, 750, 400], { stroke: "#45B7D1" }),
    ];
    // 添加到图层
    shapes.forEach((shape) => {
      layer.add(shape);
    });
    layer.batchDraw();
  };

  // 初始化画布
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      stage.ref = new Konva.Stage({
        container: containerRef.current,
        width: container.clientWidth,
        height: container.clientHeight,
        draggable: true,
      });
      // 初始化图层
      const layer = new Konva.Layer();
      stage.ref.add(layer);
      editorStore.initStage();
      // mock();
      const resizeStage = () => {
        stage.ref!.width(container.clientWidth);
        stage.ref!.height(container.clientHeight);
        stage.ref!.batchDraw();
      };
      // 监听窗口变化
      window.addEventListener("resize", resizeStage);
      // 监听缩放
      stage.ref.on("wheel", (e) => {
        e.evt.preventDefault();
        handleWheel(e.evt);
      });
      return () => {
        stage.ref?.destroy();
        window.removeEventListener("resize", resizeStage);
      };
    }
  }, []);

  // const [scale, setScale] = useState(1);
  const handleWheel = (e: any) => {
    const stageRef = stage.ref!;
    // const newScale = e.deltaY < 0 ? scale * 1.1 : scale / 1.1;
    // setScale(Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE));
    // if (stageRef.current) {
    //   stageRef.current.scale({ x: newScale, y: newScale });
    //   stageRef.current.batchDraw();
    // }
    const step = 1.1;
    const oldScale = stageRef.scaleX();
    const pointer = stageRef.getPointerPosition()!;
    let newScale = e.deltaY < 0 ? oldScale * step : oldScale / step;
    newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    const mousePointTo = {
      x: (pointer.x - stageRef.x()) / oldScale,
      y: (pointer.y - stageRef.y()) / oldScale,
    };
    stageRef.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stageRef.position(newPos);
    stageRef.batchDraw();
  };

  return (
    <div className="scene-editor">
      <Header />
      <div ref={containerRef} className="scene-editor-canvas"></div>
      <Overlay />
      <RightSider />
      {/* <Toolbar onCreate={handleCreateShape} /> */}
    </div>
  );
});

export default SceneEditor;
