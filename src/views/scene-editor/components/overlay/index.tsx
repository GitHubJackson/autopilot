import { AimOutlined } from "@ant-design/icons";
import "./index.css";
import { Button } from "antd";
import { editorStore } from "../../store";

export const Overlay = () => {
  const { stage } = editorStore;

  const focusStage = () => {
    editorStore.focusOrigin();
  };

  return (
    <div className="overlay">
      <div className="overlay-tr">
        <Button
          icon={<AimOutlined className="icon" />}
          onClick={focusStage}
        ></Button>
      </div>
    </div>
  );
};
