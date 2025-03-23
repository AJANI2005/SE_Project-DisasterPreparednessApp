import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//import pages
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import List, { CreateList } from './pages/List';
import Maps from './pages/Maps';
import Alerts from './pages/Alerts';


//main sidebar
const Sidebar = () => {
    return (
        <>
            <nav className="sidebar">
                <p>App Name</p>
                <ul className="sidebar-list-group">
                    <Link to="/">
                        <li className="sidebar-list-item">
                            <img src="src/assets/icons/home.png" className="sidebar-icon" alt="Home" />
                            <span className="sidebar-text">Home</span>
                        </li>
                    </Link>
                    <Link to="/list">
                        <li className="sidebar-list-item">
                            <img src="src/assets/icons/list.png" className="sidebar-icon" alt="List" />
                            <span className="sidebar-text">List</span>
                        </li>
                    </Link>
                    <Link to="/maps">
                        <li className="sidebar-list-item">
                            <img src="src/assets/icons/map.png" className="sidebar-icon" alt="Maps" />
                            <span className="sidebar-text">Maps</span>
                        </li>
                    </Link>
                    <Link to="/alerts">
                        <li className="sidebar-list-item">
                            <img src="src/assets/icons/bell.png" className="sidebar-icon" alt="Alerts" />
                            <span className="sidebar-text">Alerts</span>
                        </li>
                    </Link>
                    <hr className="sidebar-separator" />
                </ul>
            </nav>
        </>
    )
}


const App = () => {
    return (
        <>
            <Router>
                <Sidebar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/list/*" element={<List />} />
                        <Route path="/list/create" element={<CreateList />} />
                        <Route path="/maps/*" element={<Maps />} />
                        <Route path="/alerts/*" element={<Alerts />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Router>
        </>
    )
}

export default App
