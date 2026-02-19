import "./Toggle.css";

interface ToggleProps {
    /* value is the current state of the toggle */
    value: boolean;
    /* onChange is a callback funciton that is called when the toggle is clicked */
    onChange: (value: boolean) => void;
    /* size of the button */
    size?: number;
}

const Toggle = ({ value, onChange, size = 1 }: ToggleProps) => {
    const handleClick = () => {
        onChange(!value);
    };

    return (
        <div
            /* add the on css class if value is true */
            className={`toggle-accent ${value ? "on" : ""}`}
            /* onClick calls the handleClick function */
            onClick={handleClick}
            style={{ "--toggle-size": size } as React.CSSProperties}
        >
            <div className="toggle-dot" />
        </div>
    );
};

export default Toggle;
