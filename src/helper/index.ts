import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadGLTFWithPromise(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      function (gltf) {
        resolve(gltf);
      },
      // 加载进度回调
      undefined,
      function (error) {
        reject(error);
      }
    );
  });
}

export function loadDracoGLTFWithPromise(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // 设置解压相关文件的路径
    dracoLoader.setDecoderPath(
      // 将 three/examples/jsm/libs/draco/gltf/ 拷贝到 public 目录来用
      "./draco-gltf/"
      // 或者也可以直接用这个
      // "https://threejs.org/examples/jsm/libs/draco/gltf/"
    );
    // 使用js方式解压
    // dracoLoader.setDecoderConfig({ type: "js" });
    // 初始化 initDecoder 解码器
    dracoLoader.preload();
    // 设置GLTFLoader使用的压缩器
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      url,
      function (gltf) {
        resolve(gltf);
      },
      // 加载进度回调
      undefined,
      function (error) {
        reject(error);
      }
    );
  });
}

export function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        resolve(texture);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
