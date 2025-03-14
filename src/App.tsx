import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import { Checklist, DType, Item } from "./types/index";
import { List } from "./pages/List";
import { MiniMap } from "./pages/Map";


const Home = () => {

    const newItem = (name: string): Item => {
        let id = crypto.randomUUID();
        return {
            id,
            name,
            completed: false
        }
    }
    //  Templates
    const templates: Checklist[] = [
        {
            id: "",
            name: "Earthquake Checklist",
            progress: 0,
            items: [
                newItem("Cover your home"),
                newItem("Stay hydrated"),
                newItem("Avoid crowds")
            ],
            disasterType: DType.Earthquake
        },
        {
            id: "",
            name: "Hurricane Checklist",
            progress: 0,
            items: [
                newItem("Stock up on water"),
                newItem("Secure windows")
            ],
            disasterType: DType.Hurricane
        },

    ]

    const renderUserLinks = () => {
        const checklists = localStorage.getItem('checklists');
        const li = [];
        if (checklists) {
            const data = JSON.parse(checklists);
            let num = 1;
            for (const key in data) {
                const checklist = data[key];
                li.push(
                    <li key={checklist.id} className="list-group-item"
                        style={{ display: "grid", justifyContent: 'space-between', alignItems: "center", gridTemplateColumns: "auto auto" }}
                    >
                        <Link to={`/list`} state={{ checklist: checklist }}>
                            <span>{num + " - " + checklist.name}</span>
                        </Link>
                        <button className="btn btn-danger"
                            style={{ width: "fit-content" }}
                            onClick={() => {
                                const newChecklists = { ...JSON.parse(checklists) };
                                delete newChecklists[checklist.id];
                                localStorage.setItem('checklists', JSON.stringify(newChecklists));
                                window.location.reload();
                            }}
                        >
                            Delete
                        </button>
                    </li>
                );
                num++;
            }
        }
        return li;
    };

    const renderTemplateLinks = () => {
        const li = [];
        for (const key in DType) {
            const template = templates.find((t) => DType[t.disasterType] === key);
            if (!template) continue;

            // Generate a unique ID for the template
            const id = crypto.randomUUID();
            li.push(
                <li key={id} className="list-group-item">
                    <Link to={`/list`} state={{ checklist: { ...template, id: id } }}>
                        {key}
                    </Link>
                </li>
            );
        }
        return li;
    };


    // Create Checklist Form
    const [formVisible, setFormVisible] = useState(false);
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const name = data.get("name") as string;
        if (!name) return;
        const newList: Checklist = {
            id: crypto.randomUUID(),
            name,
            progress: 0,
            items: [],
            disasterType: DType.None
        }
        const newChecklists = { ...JSON.parse(localStorage.getItem('checklists') || '{}') };
        newChecklists[newList.id] = newList;
        localStorage.setItem('checklists', JSON.stringify(newChecklists));
        setFormVisible(false);
        window.location.reload();
    };

    return (
        <div>
            <h1>Disaster Preparation Checklists</h1>
            <Link to="/map">
                <button className="btn btn-info mt-4 mb-4">Go to Map</button>
            </Link>
            <h2>Your List</h2>
            <ul className="list-group">
                {renderUserLinks()}
            </ul>
            <h2 className="mt-3">Templates</h2>
            <ul className="list-group">
                {renderTemplateLinks()}
            </ul>


            {formVisible && (
                <form onSubmit={handleFormSubmit}>
                    <input className="form-control mt-4" type="text" name="name" placeholder="Checklist Name" />
                    <button className="btn btn-primary mt-2" type="submit">Done</button>
                </form>
            )}
            {!formVisible && (
                <button className="btn btn-primary mt-4" onClick={() => setFormVisible(true)}>Create Empty Checklist</button>
            )}
        </div>
    );
};

const App = () => {
    //Create databases
    useEffect(
        () => {
            if (!localStorage.getItem('checklists')) {
                localStorage.setItem('checklists', JSON.stringify({}));
            }
        }, []
    )

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/map" element={<MiniMap />} />
                </Routes>
            </Router>
        </>
    )
}
export default App
