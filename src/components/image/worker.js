let workerCanvas;
let ctx;
let imgBlob;
let cacheCanvas;

onmessage = async (e) => {
  console.log("Message received from main script");

  if (e.data.blob) {
    const blob = new Blob([e.data.blob], { type: "image/jpeg" });
    imgBlob = blob;
  }
  // const workerResult = "Result: " + e.data[0] * e.data[1];
  // console.log("Posting message back to main script");
  // postMessage(workerResult);
  if (e.data.canvas) {
    // 初始化OffscreenCanvas上下文
    workerCanvas = e.data.canvas;
    ctx = workerCanvas.getContext("2d");
    cacheCanvas = new OffscreenCanvas(workerCanvas.width, workerCanvas.height);

    // setInterval(() => {
    setTimeout(() => {
      generateElements();
      setTimeout(() => {
        generateElements();
      }, 1000);
    }, 2000);
  }
};

function randomColor() {
  return `rgba(${Math.floor(Math.random() * 256)},
              ${Math.floor(Math.random() * 256)},
              ${Math.floor(Math.random() * 256)},
              ${Math.random().toFixed(2)})`;
}

function createRandomRect() {
  return {
    x: Math.random() * workerCanvas.width * 0.9,
    y: Math.random() * workerCanvas.height * 0.9,
    width: 50 + Math.random() * 150,
    height: 30 + Math.random() * 120,
    color: randomColor(),
    isFill: Math.random() > 0.5, // 随机实心/空心
  };
}

function createRandomText() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return {
    text: Array(5)
      .fill()
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join(""),
    x: Math.random() * workerCanvas.width * 0.9,
    y: Math.random() * workerCanvas.height * 0.9,
    size: 12 + Math.random() * 36,
    color: randomColor(),
    angle: -30 + Math.random() * 60, // 随机旋转角度
  };
}

async function generateElements() {
  ctx.clearRect(0, 0, workerCanvas.width, workerCanvas.height);
  let cacheCtx;

  if (imgBlob) {
    // 先填充缓冲区
    if (!cacheCanvas) {
      cacheCtx = cacheCanvas.getContext("2d");
      const imgBitmap = await createImageBitmap(imgBlob);
      cacheCtx.drawImage(
        imgBitmap,
        0,
        0,
        workerCanvas.width,
        workerCanvas.height
      );
    } else {
      // 交换缓冲区
      // const imgBitmap = await createImageBitmap(imgBlob); // 零拷贝解码[1](@ref)
      // 创建离屏Canvas
      // const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
      // const ctx = canvas.getContext('2d');
      ctx.drawImage(cacheCanvas, 0, 0, workerCanvas.width, workerCanvas.height);
      cacheCtx = cacheCanvas.getContext("2d");
      const imgBitmapForCache = await createImageBitmap(imgBlob);
      cacheCtx.drawImage(
        imgBitmapForCache,
        0,
        0,
        workerCanvas.width,
        workerCanvas.height
      );
      imgBitmapForCache.close();
    }
  }

  for (let i = 0; i < 20; i++) {
    const rect = createRandomRect();
    cacheCtx.save();
    if (rect.isFill) {
      cacheCtx.fillStyle = rect.color;
      cacheCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
    } else {
      cacheCtx.strokeStyle = rect.color;
      cacheCtx.lineWidth = 2;
      cacheCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
    cacheCtx.restore();
  }

  for (let i = 0; i < 10; i++) {
    const text = createRandomText();
    cacheCtx.save();
    cacheCtx.translate(text.x, text.y);
    cacheCtx.rotate((text.angle * Math.PI) / 180);
    cacheCtx.font = `${text.size}px Arial`;
    cacheCtx.fillStyle = text.color;
    cacheCtx.fillText(text.text, 0, 0);
    cacheCtx.restore();
  }
}
