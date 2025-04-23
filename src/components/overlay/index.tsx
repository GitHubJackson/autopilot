import { Radio, RadioChangeEvent } from "antd";
import { useState } from "react";
import "./index.css";
import { myRenderer } from "../../renderer";
// import { ImageBlock } from "../image";
// import { ChartBlock } from "../chart";

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

  // const images = new Array(7).fill(undefined)

  return (
    <div className="container">
      <div className="view-container">
        <Radio.Group value={view} onChange={changeView}>
          <Radio value={EViewType.FollowCar}>跟车</Radio>
          <Radio value={EViewType.Overlook}>俯视横向</Radio>
          <Radio value={EViewType.OverlookVertical}>俯视纵向</Radio>
        </Radio.Group>
      </div>
      {/* <ImageBlock id="001" top={600} left={1200} />
      <ImageBlock id="002" top={300} left={10} />
      <ImageBlock id="003" top={600} left={10} />
      <ImageBlock id="004" top={10} left={300} />
      <ImageBlock id="005" top={10} left={600} />
      <ChartBlock id="chart1" top={600} left={300} /> */}
    </div>
  );
}
