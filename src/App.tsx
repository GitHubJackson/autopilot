import * as React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Autopilot from "./views/autopilot";
import SceneEditor from "./views/scene-editor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Autopilot />}></Route>
        <Route path="/editor" element={<SceneEditor />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
