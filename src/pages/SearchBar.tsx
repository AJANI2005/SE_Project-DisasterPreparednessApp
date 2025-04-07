import { useEffect, useState } from "react";
import { getAllChecklists } from "./Storage";
import { Checklist } from "./List";
import { useNavigate } from "react-router-dom";

import "./styles/searchBar.css"
import shelters from "../data/shelters.json"

interface Link {
    text: string;
    onClick: () => void;
}

interface SearchProps {
    showChecklists?: boolean;
    showShelters?: boolean;
}
const SearchBar = ({ showChecklists, showShelters }: SearchProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const [links, setLinks] = useState<Link[]>([]);
    //load links
    useEffect(() => {
        let links: Link[] = [];
        if (showChecklists) {
            const checklists = getAllChecklists();
            // for each checklist add a link with the name as the text and keywords
            links = links.concat(checklists.map((checklist: Checklist) => ({
                text: checklist.name,
                onClick: () => {
                    // navigate to the list view with the id as a query parameter
                    navigate(`/list/view/?id=${checklist.id}`);
                    window.location.reload(); // Refresh the page to show updated list items
                }
            })));
        }
        if (showShelters) {
            // for each shelter add a link with the name as the text and keywords
            links = links.concat(shelters.map((shelter: any) => ({
                text: shelter.properties.name,
                onClick: () => {
                    navigate(`/maps`, { state: { shelter } });
                    window.location.reload(); // Refresh the page to show updated list items
                }
            })));
            setLinks(links);

        }
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
                            // fuzzy match
                            // remove whitespace and make lowercase
                            let text = link.text.replace(/\s+/g, "").toLowerCase();
                            let term = searchTerm.replace(/\s+/g, "").toLowerCase();

                            let tIndex = 0;
                            for (let i = 0; i < text.length && tIndex < term.length; i++) {
                                if (text[i] === term[tIndex]) {
                                    tIndex++;
                                }
                            }
                            return tIndex === term.length;
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
