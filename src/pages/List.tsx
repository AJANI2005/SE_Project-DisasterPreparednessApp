import "./styles/list.css"

import { Link, useLocation, useNavigate } from "react-router-dom";
// React Hooks
import { useEffect, useState } from "react";

// Storage Helper Functions
import { getAllChecklists, getChecklist, getIcon, removeChecklist, saveChecklist, saveIcon } from "./Storage";

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

export interface Icon {
    id: string;
    data: string;
}

export interface Checklist {
    icon_id?: string;
    items: Item[];
    progress: number;
    name: string;
    description?: string;
    id: string;
    dateCreated: Date;


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

    // Saves the image as base 64 
    const handleImageChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImage(base64String);
            };
            reader.readAsDataURL(file); // Converts to base64
        }
    }
    const [chosenTemplate, setChosenTemplate] = useState<Checklist>();

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
                } as Item
            ));

            // Update state with the template items

            // Note this is not a real checklist
            setChosenTemplate({
                items: items as Item[],
                progress: 0,
                name: template_name + " Preparation Checklist",
                description: "",
                id: "dummy",
                dateCreated: new Date(),
            });

            // Go to list creation form
            setView(1);
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

        const items = chosenTemplate?.items || [];

        let icon;
        if (image) {
            icon = {
                id: crypto.randomUUID(),
                data: image
            };
            saveIcon(icon, () => { })
        }
        let newChecklist: Checklist = {
            icon_id: icon?.id,
            items: items,
            progress: 0,
            name: name,
            description: description,
            id: crypto.randomUUID(),
            dateCreated: new Date(),

        }
        saveChecklist(newChecklist);
        // Go to our new list url
        navigate("/list/view/?id=" + newChecklist.id)
    };

    const templateForm = () => {
        return (
            <>
                {/*Create using template card*/}
                <div className="card template">
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

    const createListForm = () => {
        const getDate = () => new Date().toLocaleString();
        return (
            <>
                {/*Create custom list form*/}
                <button className="back-button" onClick={() => {
                    setChosenTemplate(undefined);
                    setView(0)
                }}>
                    <img src="/icons/chevron-left.png" />
                </button>
                <form id="list-form" className="card list-form" onSubmit={(e) => { handleListForm(e) }}>
                    <ul className="card-list-group">
                        <div style={{ textAlign: "center" }}>
                            {chosenTemplate?.items.length != 0 && <h2 className="template-title">{chosenTemplate?.name}</h2>}
                        </div>
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
        {view == 1 && createListForm()}
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
                    <ListManager checklist={checklist} updateChecklist={(props) => {
                        const newChecklist = { ...checklist, ...props };
                        setChecklist(newChecklist);
                    }} />
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


interface ListManagerProps {
    checklist: Checklist;
    updateChecklist: (props: { [key: string]: any }) => void;
}
export const ListManager = ({ checklist, updateChecklist }: ListManagerProps) => {

    const [icon_data, setIconData] = useState<any>();

    //attempt to get icon
    useEffect(() => {
        if (checklist.icon_id) {
            getIcon(checklist.icon_id, (error, icon) => {
                if (!error) {
                    setIconData(icon?.data);
                }
            });
        }
    }, []);

    // Save any changes to items
    useEffect(() => {

        // Update progress 
        if (checklist.items.length > 0) {
            const completedItems = checklist.items.filter(item => item.completed).length;
            const progress = completedItems / checklist.items.length;
            updateChecklist({ progress });
        }
        // Save data to local storage
        saveChecklist(checklist);

    }, [checklist.items]) // run when items state changes


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
        const newItems = [...checklist.items, newItem];
        updateChecklist({ items: newItems });
        // clear the text field
        form.reset();
    };

    return (
        <>

            <div className="lm">
                <div className="lm-header-wrapper">
                    <div className="lm-header-icon">
                        {icon_data && <img src={icon_data} className="img-icon" />}
                    </div>
                    <div className="lm-header">
                        <Link to={"/list/view/?id=" + checklist.id}>
                            <div className="lm-icon" >
                                <img src="/icons/folder.png" />
                            </div>
                        </Link>
                        <div>
                            <h3 className="lm-title">{checklist.name}</h3>
                            <span className="lm-date">{checklist.dateCreated.toLocaleString()}</span>
                        </div>
                        <span className="lm-progress-text">{checklist.progress * checklist.items.length} of {checklist.items.length}</span>
                    </div>
                </div>

                <ul className="lm-list-group">
                    {

                        checklist.items.map((item, index) => (
                            <li key={index} className="lm-list-group-item">
                                <input
                                    type="checkbox"
                                    className="lm-form-check-input"
                                    checked={item.completed}
                                    onChange={(e) => {
                                        const newItems = checklist.items.map(i =>
                                            i.id === item.id ? { ...i, completed: e.target.checked } : i
                                        );
                                        updateChecklist({ items: newItems });
                                    }}
                                />
                                {
                                    <p className={"lm-item-text" + String(item.completed ? " strike-through" : "")}>{item.name}</p>
                                }
                                <button className="lm-x-btn" onClick={
                                    () => {
                                        if (!updateChecklist) return;
                                        const newItems = checklist.items.filter(i => i.id !== item.id);
                                        updateChecklist({ items: newItems });
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
    }, []); // reload the checklists when a list is modified

    return (
        <>
            <div className="list-overview">
                {
                    checklists.map((checklist: Checklist) => (
                        <div key={checklist.id} className="lm-container">
                            <ListManager checklist={checklist} updateChecklist={
                                (props) => {
                                    const newLists = checklists.map(c =>
                                        c.id === checklist.id ? { ...c, ...props } : c
                                    );
                                    setChecklists(newLists);
                                }} />
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
