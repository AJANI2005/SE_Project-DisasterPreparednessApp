import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Checklist, Item } from "../types/index";

export const List = () => {
    const location = useLocation();
    const [checklist, setChecklist] = useState<Checklist>();
    const [formVisible, setFormVisible] = useState(false);

    // Load checklist from localStorage on mount
    useEffect(() => {
        let storedChecklists = localStorage.getItem("checklists");
        let data = storedChecklists ? JSON.parse(storedChecklists) : {};

        if (location.state?.checklist) {
            // Checklist has already been loaded
            if (data[location.state.checklist.id]) {
                setChecklist(data[location.state.checklist.id]);
            } else {
                // Checklist hasnt been loaded
                setChecklist(location.state.checklist);
            }
        }

    }, [location.state]);

    // Save changes to localStorage
    useEffect(() => {
        if (checklist) {
            let storedChecklists = localStorage.getItem("checklists");
            let data = storedChecklists ? JSON.parse(storedChecklists) : {};
            data[checklist.id] = checklist;
            localStorage.setItem("checklists", JSON.stringify(data));
        }
    }, [checklist]);

    // Update checklist progress based on completed items
    useEffect(() => {
        if (checklist) {
            const completedItems = checklist.items.filter((i: Item) => i.completed).length;
            setChecklist({ ...checklist, progress: completedItems / checklist.items.length * 100 });
        }
    }, [checklist?.items])

    if (!checklist) {
        return <h1>Attempting to Load Checklist...</h1>
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const name = data.get("name") as string;
        if (!name) return;

        const newItem: Item = { id: crypto.randomUUID(), name, completed: false };
        setChecklist(prev => prev ? { ...prev, items: [...prev.items, newItem] } : prev);
        setFormVisible(false);
    };

    return (
        <div>
            <h1>{checklist.name}</h1>
            <div className="progress mb-4">
                <div className="progress-bar" role="progressbar" style={{ width: `${checklist.progress}%` }}></div>
            </div>
            <ul className="list-group">
                {checklist.items.map((item: Item) => (
                    <li key={item.id} className={`list-group-item ${item.completed ? 'list-group-item-success' : ''}`}
                        style={{ display: "grid", alignItems: "center", gridTemplateColumns: "auto 1fr auto" }}
                    >
                        <input
                            type="checkbox"
                            className="form-check-input me-4"
                            checked={item.completed}
                            onChange={(e) => {
                                const newItems = checklist.items.map(i =>
                                    i.id === item.id ? { ...i, completed: e.target.checked } : i
                                );
                                setChecklist(prev => prev ? { ...prev, items: newItems } : prev);
                            }}
                        />
                        <span>{item.name}</span>
                        <button className="btn btn-danger ms-4" style={{ width: "fit-content" }}
                            onClick={() => {
                                const newItems = checklist.items.filter(i => i.id !== item.id);
                                setChecklist(prev => prev ? { ...prev, items: newItems } : prev);
                            }}
                        >Remove</button>
                    </li>
                ))}
            </ul>
            {formVisible && (
                <form onSubmit={handleFormSubmit}>
                    <input className="form-control mt-4" type="text" name="name" placeholder="Item Name" />
                    <button className="btn btn-primary mt-2" type="submit">Done</button>
                </form>
            )}
            {!formVisible && (
                <button className="btn btn-success mt-4" onClick={() => setFormVisible(true)}>Add Item</button>
            )}
        </div>
    );
};

