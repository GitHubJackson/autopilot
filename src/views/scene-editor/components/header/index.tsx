import { Button, Divider, Radio } from "antd";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { editorStore } from "../../store";
import { EditMode, EMapElement, ESceneElement } from "../../store/type";
import "./index.css";

export const Header = observer(() => {
  const { editMode, selectedElement } = editorStore;

  const changeEditMode = (e: any) => {
    editorStore.editMode = e.target.value;
  };

  const addMapElement = (type: EMapElement) => {
    editorStore.drawCallForMap(type);
  };
  const addSceneElement = (type: ESceneElement) => {
    editorStore.drawCallForScene(type);
  };

  const saveFile = () => {
    editorStore.saveFile();
  };

  const sim = () => {
    location.href = "http://localhost:5173";
    // window.open("http://localhost:5173", "_blank");
  };

  const drawPath = () => {
    editorStore.drawCallForScene(ESceneElement.Path);
  };

  return (
    <div className="scene-editor-header">
      <div className="scene-editor-header-left">
        <div className="title">Scene Editor</div>
      </div>
      <div className="scene-editor-header-right">
        <Radio.Group
          onChange={changeEditMode}
          value={editMode}
          style={{ color: "#fff" }}
          options={[
            { value: EditMode.Map, label: "编辑地图" },
            { value: EditMode.Scene, label: "编辑场景" },
          ]}
        ></Radio.Group>
        <Button onClick={saveFile}>保存</Button>
        <Button onClick={drawPath} disabled={selectedElement === null}>
          路线
        </Button>
        {editMode === EditMode.Map ? (
          <div className="btns">
            <Button onClick={() => addMapElement(EMapElement.Line)}>线</Button>
            <Button onClick={() => addMapElement(EMapElement.Lane)}>
              车道
            </Button>
            <Button
              disabled
              onClick={() => addMapElement(EMapElement.Junction)}
            >
              路口
            </Button>
            <Button disabled>红绿灯</Button>
            <Button disabled>停车位</Button>
          </div>
        ) : (
          <div className="btns">
            <Button onClick={() => addSceneElement(ESceneElement.Vehicle)}>
              他车
            </Button>
            <Button
              disabled
              onClick={() => addSceneElement(ESceneElement.Obstacle)}
            >
              障碍物
            </Button>
          </div>
        )}
        <Divider type="vertical" />
        <Button onClick={sim}>autopilot</Button>
      </div>
    </div>
  );
});
