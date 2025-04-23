import { useEffect, useRef } from "react";
import Stats from "stats.js";
import { myRenderer } from "../../renderer";
import { Overlay } from "../../components/overlay";
import "./index.css";
import { ISceneData } from "../scene-editor/store/type";

function Autopilot() {
  const statsRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0);
    statsRef.current = stats;
    containerRef.current.appendChild(stats.dom);
    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      containerRef.current?.removeChild(stats.dom);
    };
  }, []);

  useEffect(() => {
    myRenderer.initialize();
  }, []);

  useEffect(() => {
    const sceneData = localStorage.getItem("sceneData");
    const data = JSON.parse(sceneData || "{}") as ISceneData;
    console.log("===sceneData===", data);
    myRenderer.loadSceneData(data);
  }, []);

  return (
    <>
      <div id="my-canvas"></div>
      <Overlay />
      <div className="monitor">
        <div className="fps" ref={containerRef}></div>
      </div>
    </>
  );
}

export default Autopilot;
