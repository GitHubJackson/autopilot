import { useEffect } from "react";
import { myRenderer } from "./renderer";
import "./App.css";
import { Overlay } from "./components/overlay";

function App() {
  useEffect(() => {
    myRenderer.initialize();
  }, []);

  return (
    <>
      <div id="my-canvas"></div>
      <Overlay />
    </>
  );
}

export default App;
