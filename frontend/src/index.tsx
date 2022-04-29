import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { PlayPage } from "./routes/play";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/stage" element={<App />} />
      <Route path="/stage/play" element={<PlayPage />}>
        <Route path=":videoId" element={<PlayPage />} />
      </Route>
    </Routes>
    <footer>
      Videos either licensed under public domain or used with explicit
      permission of the creator(s).
    </footer>
  </BrowserRouter>
);

reportWebVitals();
