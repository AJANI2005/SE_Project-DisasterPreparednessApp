import { useState } from "react";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

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
            </div>
        </>
    );
}

export default SearchBar;
