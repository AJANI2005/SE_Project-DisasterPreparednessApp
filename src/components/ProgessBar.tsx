import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import "./styles/progressBar.css"

interface Props {
    current: number;
}
const ProgressBar: React.FC<Props> = ({ current }) => {
    const [target, setTarget] = useState(0);

    //Animate
    useEffect(() => {
        // Update width
        let bar = document.getElementById("loader-bar");
        if (bar) {
            bar.style.width = `${target}%`;
        }
        // Update the progress bar
        setTarget(prev => {
            if (prev < current) return prev + 1;
            if (prev > current) return prev - 1;
            return prev;
        });
    }, [current, target]);

    return <>
        <div className="loader">
            <div id="loader-bar"></div>
        </div>
    </>
}

export default ProgressBar;


