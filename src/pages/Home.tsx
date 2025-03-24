import { useEffect, useState } from "react";
import { Checklist } from "./List";
import ProgressBar from "./ProgressBar";
import { getAllChecklists } from "./Storage";
import "./styles/home.css";


const Home = () => {

    const [checklists, setChecklists] = useState<Checklist[]>([]);

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
                        </ul>
                        <span>{Math.round(checklist.progress * 100)}%</span>
                        <span>{checklist.progress != 1 && "Not completed" || "Completed"}</span>
                        <ProgressBar progress={checklist.progress} color={"blue"} />
                    </div>
                ))
            }
        </div>

    </>)
};
export default Home; 3
