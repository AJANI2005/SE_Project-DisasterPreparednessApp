import "./styles/progressBar.css"
interface Props {
    progress: number,
    color: string
}

const ProgressBar = ({ progress, color }: Props) => {
    // Ensure progress is between 0 and 1
    // Define the custom style for the progress bar color
    const progressBarStyle = {
        width: `${progress}%`,
        backgroundColor: color || '#007bff', // Default to blue if no color is provided
    };

    return (
        <div className="progress">
            <div
                className="progress-bar"
                role="progressbar"
                style={progressBarStyle}
            >
            </div>
        </div>
    );
};

export default ProgressBar;
