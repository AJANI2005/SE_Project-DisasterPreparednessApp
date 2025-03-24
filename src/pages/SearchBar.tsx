import { useEffect, useState } from "react";
import { getAllChecklists } from "./Storage";
import { Checklist } from "./List";
import { useNavigate } from "react-router-dom";

import "./styles/searchBar.css"

interface Link {
    text: string;
    onClick: () => void;
}

const SearchBar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const [links, setLinks] = useState<Link[]>([]);
    //load links
    useEffect(() => {
        // fetch links from API or local storage
        const checklists = getAllChecklists();
        // for each checklist add a link with the name as the text and keywords
        const links = checklists.map((checklist: Checklist) => ({
            text: checklist.name,
            onClick: () => {
                // navigate to the list view with the id as a query parameter
                navigate(`/list/view/?id=${checklist.id}`);
                window.location.reload(); // Refresh the page to show updated list items
            }
        }));
        //...
        setLinks(links);
    }, [])

    const resultsVisible = () => {
        return searchTerm.trim().length > 0 && links.length > 0 ? "block" : "none";

    }
    return (
        <>
            <div className="search-container">
                <div className="search-bar">
                    <img className="search-icon" src="/icons/search.png" />
                    <input
                        onChange={handleSearchChange}
                        value={searchTerm}
                        type="text"
                        placeholder="Search" />
                </div>


                <ul className="search-results"
                    style={
                        { display: resultsVisible() }
                    }
                >
                    {
                        // Render links
                        searchTerm && links.filter(link => {

                            // string match algorithm
                            let text = link.text.replace(/\s+/g, ""); // Removes all spaces
                            let term = searchTerm.replace(/\s+/g, ""); // Removes all spaces
                            let match = true;
                            let i = 0;
                            for (let t of term) {
                                if (i >= text.length) { break; }
                                let c = text[i];
                                if (c.toLowerCase() != t.toLowerCase()) {
                                    match = false;
                                }
                                i++;
                            }
                            return match;
                        })
                            .map((link, index) => (
                                <li key={index} onClick={link.onClick} className="search-result-item">
                                    <span>{link.text}</span>
                                </li>
                            ))
                    }
                </ul>
            </div>
        </>
    );
}

export default SearchBar;
