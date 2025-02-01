import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BoxList from "./components/Boxlists/BoxList";
import More from "./components/more/More";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/serial" element={<BoxList />} />
          <Route path="/more/:serial" element={<More />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
