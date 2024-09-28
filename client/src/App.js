import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./pages/User";
import Company from "./pages/Company";
import HomePage from "./pages/HomePage";
import './index.css';
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path = '/user' element ={<User/>}/>

        <Route path='/company/:id' element ={<HomePage/>}>
            <Route path = '/company/:id' element ={<Company/>}/>
        </Route>
        
      </Routes>
    </div>
  );
}

export default App;
