import "./styles/list.css"

import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
// React Hooks
import { useEffect, useState } from "react";

// Storage Helper Functions
import { getAllChecklists, getChecklist, removeChecklist, saveChecklist } from "./Storage";

import SearchBar from "./SearchBar";

// import template data
import templates from "../data/templates.json";

export interface Item {
    id: string;
    name: string;
    completed: boolean;
}

export interface TemplateItem {
    id?: string;
    name: string;
    completed?: boolean;
}

export interface Checklist {
    items: Item[];
    progress: number;
    name: string;
    description?: string;
    id: string;
    dateCreated: Date;
    update?: (object: Object) => void;
}

interface Template {
    name: string;
    items: TemplateItem[];
}

export const CreateList = () => {

    // Navigation 
    const navigate = useNavigate();
    // State
    const [image, setImage] = useState<undefined | string>(undefined); // State to hold the selected image URL
    const [view, setView] = useState(0); //]
    const handleImageChange = (e: any) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create a preview URL
            setImage(imageUrl); // Update state with the image URL
        }
    }

    // Creates a new template checklist with a new id and returns the url for it
    const createNewTemplate = (template_name: string) => {
        //get the items for that check list template
        const template = templates.find((t: Template) => t.name == template_name);
        if (template) {
            let items = template.items;

            // add completed field (because templates dont have it yet)
            items = items.map((item: TemplateItem) => (
                {
                    id: crypto.randomUUID(),
                    name: item.name,
                    completed: false
                }
            ));

            // create the template checklist
            const newChecklist: Checklist = {
                items: items as Item[],
                progress: 0,
                name: template.name + " Preparation List",
                description: "Template checklist for a " + template.name + ", Stay Prepared!",
                id: crypto.randomUUID(),
                dateCreated: new Date()
            }
            saveChecklist(newChecklist);
            // Go to our new list url
            navigate("/list/view/?id=" + newChecklist.id)
        } else {
            // TODO : Have this redirect to an internal server error page (500)
            navigate("/list")
        }
    }
    const handleListForm = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const name = data.get("name") as string;
        const description = data.get("description") as string || "";
        if (!name) return;
        const newChecklist: Checklist = {
            items: [],
            progress: 0,
            name: name,
            description: description,
            id: crypto.randomUUID(),
            dateCreated: new Date()
        }
        saveChecklist(newChecklist);
        // Go to our new list url
        navigate("/list/view/?id=" + newChecklist.id)
    };

    const templateForm = () => {
        return (
            <>
                {/*Create using template card*/}
                <div className="card">
                    <ul className="card-list-group">
                        <a onClick={() => { createNewTemplate("Hurricane") }}>
                            <li className="card-list-item">
                                <img src="/icons/folder.png" className="card-icon icon" alt="Home" />
                                <span className="card-text">Hurricane Preparation List</span>
                            </li>
                        </a>
                        <a onClick={() => { createNewTemplate("Earthquake") }}>
                            <li className="card-list-item">
                                <img src="/icons/folder.png" className="card-icon icon" alt="List" />
                                <span className="card-text">Earthquake Preparation List</span>
                            </li>
                        </a>
                        <a onClick={() => { createNewTemplate("Volcano") }}>
                            <li className="card-list-item">
                                <img src="/icons/folder.png" className="card-icon icon" alt="Maps" />
                                <span className="card-text">Volcano Preparation List</span>
                            </li>
                        </a>
                        <button className="card-button card-text" onClick={() => { setView(1) }}>Create my own</button>
                    </ul>
                </div>

            </>
        );
    }

    const customListForm = () => {
        const getDate = () => new Date().toLocaleString();
        return (
            <>
                {/*Create custom list form*/}
                <button className="back-button" onClick={() => { setView(0) }}>
                    <img src="/icons/chevron-left.png" />
                </button>
                <form id="list-form" className="card list-form" onSubmit={(e) => { handleListForm(e) }}>
                    <ul className="card-list-group">
                        <div className="list-form-icon-wrapper">
                            <div className="list-form-icon-container">
                                {image && <img className="list-form-icon" alt="" src={image} />}
                            </div>
                            <div className="list-form-input-container">
                                <div className="list-form-input-image">
                                    <img src="/icons/edit-3.png" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        id="fileInput"
                                    />
                                </div>
                            </div>
                        </div>
                        <input name="name" type="text" placeholder="List Name" className="card-list-item card-text" required />
                        <input name="description" type="text" placeholder="List Description" className="card-list-item card-text" />
                        <div className="card-list-item card-text"
                            style={{ display: "inline-block" }}
                        >
                            <span>Date Created</span>
                            <span style={{ float: "right" }}>{getDate()}</span>
                        </div>
                        <button form="list-form" type="submit" className="card-button card-text">Create List</button>
                    </ul>
                </form >
            </>
        )
    }

    return (<>

        <header>
            <h2>Create List</h2>
            <h3>Select a template to start preparing</h3>
        </header>
        {view == 0 && templateForm()}
        {view == 1 && customListForm()}
    </>)
}



export const ViewList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    // Load the checklist using the id
    const [checklist, setChecklist] = useState<Checklist | undefined>(undefined);

    // Attempt to load the checklist from local storage
    useEffect(() => {
        if (id) {
            const fetchedList = getChecklist(id);
            if (fetchedList) {
                setChecklist(fetchedList);
            }
        }
    }, [])

    // We couldnt find the checklist :(
    if (!id || !checklist) {
        return (<>
            <h1>No checklist found with the provided ID.</h1>
            <Link to="/list/create">Create a new checklist</Link>
        </>)
    }


    return (
        <>
            <header>
                <h2>Checklists</h2>
                <h3>Click to view each checklist</h3>
            </header>
            <SearchBar />
            <div className="list-wrapper">
                <div className="list-container">
                    <ListManager
                        id={checklist.id}
                        name={checklist.name}
                        description={checklist.description}
                        dateCreated={checklist.dateCreated}
                        items={checklist.items}
                        progress={checklist.progress}
                        update={(object) => {
                            const newChecklist = { ...checklist, ...object };
                            setChecklist(newChecklist);
                        }}
                    />
                </div>
            </div>
            <button className="remove-list-btn" onClick={
                () => {
                    removeChecklist(checklist.id);
                    navigate("/list");
                    alert(checklist.name + " has been removed");
                }
            }>Remove Checklist</button>
        </>)
}



export const ListManager = ({ id, name, description, dateCreated, items, progress, update }: Checklist) => {


    // Save any changes to items
    useEffect(() => {

        // Update progress 
        if (items.length > 0) {
            const completedItems = items.filter(item => item.completed).length;
            progress = completedItems / items.length;
            if (update) {
                update({ progress });
            }
        }
        // Save data to local storage
        saveChecklist({ id, name, description, dateCreated, items, progress });
    }, [items])

    const handleAddItemForm = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const name = data.get("name") as string;
        if (!name) return;

        const newItem: Item = {
            id: crypto.randomUUID(),
            name: name,
            completed: false,
        }
        const newItems = [...items, newItem];
        if (update) { update({ items: newItems }); }
        // clear the text field
        form.reset();
    };

    return (
        <>
            <div className="lm">
                <div className="lm-header">
                    <Link to={"/list/view/?id=" + id}>
                        <div className="lm-icon" >
                            <img src="/icons/folder.png" />
                        </div>
                    </Link>
                    <div>
                        <h3 className="lm-title">{name}</h3>
                        <span className="lm-date">{dateCreated.toLocaleString()}</span>
                    </div>
                    <span className="lm-progress-text">{progress * items.length} of {items.length}</span>
                </div>

                <ul className="lm-list-group">
                    {

                        items.map((item, index) => (
                            <li key={index} className="lm-list-group-item">
                                <input
                                    type="checkbox"
                                    className="lm-form-check-input"
                                    checked={item.completed}
                                    onChange={(e) => {
                                        if (!update) return;
                                        const newItems = items.map(i =>
                                            i.id === item.id ? { ...i, completed: e.target.checked } : i
                                        );
                                        update({ items: newItems });
                                    }}
                                />
                                {
                                    <p className={"lm-item-text" + String(item.completed ? " strike-through" : "")}>{item.name}</p>
                                }
                                <button className="lm-x-btn" onClick={
                                    () => {
                                        if (!update) return;
                                        const newItems = items.filter(i => i.id !== item.id);
                                        update({ items: newItems });
                                    }

                                }>X</button>
                            </li>
                        ))
                    }
                    <form className="item-form" onSubmit={handleAddItemForm}>
                        <div className="lm-list-group-item">
                            <input type="checkbox" checked={false} onChange={() => { }} className="lm-form-check-input" />
                            <input name="name" className="item-form-input-text" type="text" placeholder="Add new task" required />
                        </div>
                    </form>
                </ul>
            </div >
        </>)
}

const ListOverview = () => {
    const [checklists, setChecklists] = useState<Checklist[]>([]);

    // Attempt to load the checklists from local storage
    useEffect(() => {
        const fetchedLists = getAllChecklists();
        if (fetchedLists) {
            setChecklists(fetchedLists);
        }
    }, []);




    return (
        <>
            <div className="list-overview">
                {
                    checklists.map((checklist: Checklist) => (
                        <div key={checklist.id} className="lm-container">
                            <ListManager
                                id={checklist.id}
                                name={checklist.name}
                                description={checklist.description}
                                dateCreated={checklist.dateCreated}
                                items={checklist.items}
                                progress={checklist.progress}
                                update={(object) => {
                                    const newLists = checklists.map(c =>
                                        c.id === checklist.id ? { ...c, ...object } : c
                                    );
                                    setChecklists(newLists);
                                }}
                            />
                        </div>
                    ))
                }
            </div>
        </>);

}


const List = () => {
    return (
        <>
            <h2>Checklists</h2>
            <h3>Click to view each checklist</h3>

            <SearchBar />
            <Link to="/list/create">
                <button className="add-button">Add New List</button>
            </Link>
            <ListOverview />

        </>)
}
export default List;
