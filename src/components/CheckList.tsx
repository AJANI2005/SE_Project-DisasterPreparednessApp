import { useState } from 'react'
import "./styles/checklist.css"
import ProgressBar from './ProgessBar';


const CheckList = () => {

    const [list, setList] = useState<any[]>([
        { title: "Stock up on water", completed: false, icon: "💧" },
        { title: "Prepare emergency food supplies", completed: false, icon: "🍲" },
        { title: "Secure windows and doors", completed: false, icon: "🔒" },
        { title: "Charge power banks and devices", completed: false, icon: "🔌" },
        { title: "Create an emergency contact list", completed: false, icon: "📞" }
    ]);
    const [progress, setProgress] = useState<number>(0);

    const updateProgress = () => {
        const completedItems = list.filter(item => item.completed).length;
        const totalItems = list.length;
        const progress = Math.round((completedItems / totalItems) * 100);
        setProgress(progress);
    }
    return <>
        <h1>Preparation Check List</h1>
        <div className="list-container">
            <ProgressBar current={progress} />
            <ul className="list-group">
                {
                    list.map((item, index) =>
                        <li key={index} className="list-group-item">
                            <div className="container">
                                <span className="item-icon">{item.icon || "🟦"}</span>
                                <span className="m-2">{item.title}</span>
                                <input className="list-check-input" type="checkbox"
                                    onChange={(e) => {
                                        item.completed = e.target.checked;
                                        updateProgress()
                                    }}
                                />
                            </div>
                        </li>
                    )
                }
            </ul >
        </div>
    </>

}

export default CheckList
