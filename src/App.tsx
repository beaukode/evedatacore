import { Paper } from "@mui/material";
import { Route, Routes, useLocation } from "react-router";
import Explore from "@/pages/Explore";
import Home from "@/pages/Home";
import Error404 from "@/pages/Error404";
import About from "@/pages/About";
import Calculate from "@/pages/Calculate";
import Dev from "@/pages/Dev";
import DApps from "@/dapps/DApps";
import Header from "./components/layout/Header";
import DappHeader from "./components/layout/DappHeader";
import DappFooter from "./components/layout/DappFooter";

function App() {
  const location = useLocation();

  const isDApp = location.pathname.startsWith("/dapps");

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",        
      }}
    >
      {isDApp ? <DappHeader /> : <Header />}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dapps/*" element={<DApps />} />
        <Route path="/explore/*" element={<Explore />} />
        <Route path="/calculate/*" element={<Calculate />} />
        <Route path="/dev/*" element={<Dev />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      {isDApp && <DappFooter />}
    </Paper>
  );
}

export default App;
