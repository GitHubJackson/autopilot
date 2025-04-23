import { useEffect } from "react";
import MyWorker from "./worker.js?worker";
import TestImg from "@/assets/test.png";
import "./index.css";

interface IProps {
  id: string;
  top: number;
  left: number;
}

export const ImageBlock = (props: IProps) => {
  const canvasId = "image-canvas-" + props.id;

  useEffect(() => {
    const mainCanvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const offscreenCanvas = mainCanvas.transferControlToOffscreen();
    // worker.postMessage("start");
    const worker = new MyWorker();
    worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);
    const img = new Image();
    img.src = TestImg;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          worker.postMessage({ blob });
        },
        "image/jpeg",
        0.86
      );
    };
  }, []);

  return (
    <div
      className={"image-container"}
      style={{ top: props.top, left: props.left }}
    >
      <canvas id={canvasId}></canvas>
    </div>
  );
};
