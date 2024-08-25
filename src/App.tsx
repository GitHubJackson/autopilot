import { useEffect } from "react";
import { myRenderer } from "./renderer";
import "./App.css";

function App() {
  useEffect(() => {
    myRenderer.initialize();
  }, []);

  return (
    <>
      <div id="my-canvas"></div>
    </>
  );
}

export default App;
