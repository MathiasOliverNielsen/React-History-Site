import { BrowserRouter, Routes, Route } from "react-router";
import { TodayPage } from "./pages/Today/TodayPage";
import { ByDatePage } from "./pages/ByDate/ByDatePage";
import { SincePage } from "./pages/Since/SincePage";
import "./styles/globals.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/by-date" element={<ByDatePage />} />
        <Route path="/since" element={<SincePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
