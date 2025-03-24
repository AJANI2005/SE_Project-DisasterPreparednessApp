import "./styles/progressBar.css"
interface Props {
    progress: number,
    color: string
}

const ProgressBar = ({ progress, color }: Props) => {
    // Ensure progress is between 0 and 1
    const validProgress = Math.min(Math.max(progress, 0), 1);

    // Convert progress to a percentage
    const progressPercentage = validProgress * 100;

    // Define the custom style for the progress bar color
    const progressBarStyle = {
        width: `${progressPercentage}%`,
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
