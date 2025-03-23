import { Link, Route, Routes } from "react-router-dom";
import "./styles/list.css"


export const CreateList = () => {
    return (<>

        <header>
            <h2>Create List</h2>
            <h3>Select a template to start preparing</h3>
        </header>
        {/*Create using template card*/}
        <div className="template-card">
            <input type="text" />
        </div>
        {/*Create custom list form*/}
        <form className="list-form">
            <input type="text" />
        </form>
    </>)
}


const List = () => {
    return (
        <>
            <header>
                <h2>Checklists</h2>
                <h3>Click to view each checklist</h3>
            </header>

            <div className="search-container">
                <div className="search-bar">
                    <img className="search-icon" src="src/assets/icons/search.png" />
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <Link to="/list/create">
                <button className="add-button">Add New List</button>
            </Link>
        </>)
}
export default List;
