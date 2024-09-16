import { Radio, RadioChangeEvent } from "antd";
import { useState } from "react";
import "./index.css";
import { myRenderer } from "../../renderer";

enum EViewType {
  FollowCar,
  Overlook,
  OverlookVertical,
}

export function Overlay() {
  const [view, setView] = useState(EViewType.FollowCar);

  function changeView(e: RadioChangeEvent) {
    setView(e.target.value);
    myRenderer.switchCameraView(e.target.value);
  }

  return (
    <div className="container">
      <div className="view-container">
        <Radio.Group value={view} onChange={changeView}>
          <Radio value={EViewType.FollowCar}>跟车</Radio>
          <Radio value={EViewType.Overlook}>俯视横向</Radio>
          <Radio value={EViewType.OverlookVertical}>俯视纵向</Radio>
        </Radio.Group>
      </div>
    </div>
  );
}
