import "./App.css";

import Home from "./Components/Home";
import Iframe from "./Components/Iframe";
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { CreateLink, TrackPage } from './Components/Test';


function App() {
  return (
    <>
      {/* <Home /> */}
      {/* <Iframe /> */}
      <Router>
      <Routes>
        <Route path="/" element={<CreateLink     />} />
        <Route path="/track/:id" element={<TrackPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
