import { useEffect, useState } from "react";
import { Checklist } from "./List";
import ProgressBar from "./ProgressBar";
import { getAllChecklists } from "./Storage";
import "./styles/home.css";
import { useNavigate } from "react-router-dom";


const Home = () => {

    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const navigate = useNavigate();
    // Attempt to load the checklists from local storage
    useEffect(() => {
        const fetchedLists = getAllChecklists();
        if (fetchedLists) {
            setChecklists(fetchedLists);
        }
    }, []);


    return (<>
        <h1>Welcome</h1>
        <h2>Checklist Progress</h2>
        <div className="progress-card-container">
            {
                checklists.map((checklist: Checklist) => (
                    <div className="progress-card" key={checklist.id}>
                        <ul className="progress-card-list-group">
                            <li className="progress-card-list-item">
                                <p className="progress-card-title">{checklist.name}</p>
                            </li>
                            {/*List info (description)*/}
                            <li className="progress-card-list-item">
                                <p className="progress-card-description">{checklist.description}</p>
                            </li>
                            <button className="goto-btn" onClick={() => {
                                navigate("/list/view/?id=" + checklist.id);
                            }}>GO</button>
                        </ul>
                        <div className="progress-card-progress-container">
                            <div style={{ marginBottom: "10px" }}>
                                <span className="progress-card-progress">{Math.round(checklist.progress * 100)}%</span>
                                <span className="progress-card-progress-text">{checklist.progress != 1 && "Not completed" || "Completed"}</span>
                            </div>
                            <ProgressBar progress={checklist.progress} color={"blue"} />
                        </div>
                    </div>
                ))
            }
        </div>

    </>)
};
export default Home; 3
