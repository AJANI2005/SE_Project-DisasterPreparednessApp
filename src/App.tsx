import { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//import pages
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import List, { CreateList, ViewList } from './pages/List';
import Maps from './pages/Maps';
import Alerts from './pages/Alerts';
import { initStorage } from './pages/Storage';



//main sidebar
const Sidebar = () => {
    return (
        <>
            <nav className="sidebar">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-text">SafetyNet</span>
                </div>

                <ul className="sidebar-list-group">
                    <Link to="/">
                        <li className="sidebar-list-item">
                            <img src="/icons/home.png" className="sidebar-icon icon" alt="Home" />
                            <span className="sidebar-text">Home</span>
                        </li>
                    </Link>
                    <Link to="/list">
                        <li className="sidebar-list-item">
                            <img src="/icons/list.png" className="sidebar-icon icon" alt="List" />
                            <span className="sidebar-text">List</span>
                        </li>
                    </Link>
                    <Link to="/maps">
                        <li className="sidebar-list-item">
                            <img src="/icons/map.png" className="sidebar-icon icon" alt="Maps" />
                            <span className="sidebar-text">Maps</span>
                        </li>
                    </Link>
                    <Link to="/alerts">
                        <li className="sidebar-list-item">
                            <img src="/icons/bell.png" className="sidebar-icon icon" alt="Alerts" />
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

    // Initialize our local storage
    useEffect(() => {
        initStorage();
    })

    return (
        <>
            <Router>
                <Sidebar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route path="/list/*" element={<List />} />
                        <Route path="/list/create" element={<CreateList />} />
                        <Route path="/list/view" element={<ViewList />} />

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
