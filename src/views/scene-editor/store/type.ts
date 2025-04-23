import Konva from "konva";
import { ILine } from "../../../renderer/line";
import { IFreespace } from "../../../renderer/freespace";
import { ICube } from "../../../renderer/cube";

export enum EditMode {
  Map,
  Scene,
}

export enum EMapElement {
  Line = "line",
  Lane = "lane",
  Junction = "junction",
  TrafficLight = "trafficLight",
  ParkingSpace = "parkingSpace",
}

export enum ESceneElement {
  Vehicle = "vehicle",
  Obstacle = "obstacle",
  Path = "path",
}

export interface IAutoCar {
  ref: Konva.Rect | null;
  path: number[][];
  speed: number;
  pathLine: Konva.Line | null;
}

export interface IMapElements {
  lines: ILine[];
  lanes: IFreespace[];
}

export interface ISceneElements {
  vehicles: (ICube & { speed: number; path: number[][] })[];
  obstacles: ICube[];
}
export interface ISceneData {
  autoCar: {
    pos: number[];
    rotation: number;
    path: number[][];
    speed: number;
  };
  map: IMapElements;
  scene: ISceneElements;
}
