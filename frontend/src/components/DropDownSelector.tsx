import { useState, useRef, useEffect } from "react";

interface DropDownProps {
    options: Array<string>;
    option: string;
    setOption: (option: string) => void;
    size?: number;
}

function DropDownSelector({ options, option, setOption, size = 1 }: DropDownProps) {
    const dropDownRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Hides the DropDown Panel when an unrelated area of the screen is clicked
    useEffect(() => {
        function checkClickBounds(event: MouseEvent) {
            if (isOpen && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        // creates a new listener
        document.addEventListener("mousedown", checkClickBounds);
        // returns a function that removes the eventListener
        // The function gets called jsut before re render
        return () => { document.removeEventListener("mousedown", checkClickBounds) }
    }, 
    // useEffect is only called when isOpen gets modified and causes a re-render
    [isOpen])

    return (
        // dropDownRef gets assigned on render
        <div
            ref={dropDownRef}
            className="boundry"
        >
            <div className="current-item">Theme: {option}</div>
            <button
                className="drop-button"
                // swap the state of isOpen
                onClick={() => { setIsOpen(!isOpen) }}
            >
            </button>

            {isOpen && (
                // create new list element for each item in - current selection
                <div className="item-list">
                    {options.map((item) => {
                        if (item == option) {
                            return null;
                        } else {
                            return (
                                <li
                                    key={item}
                                    className="item"
                                    // set the current selection
                                    // The current option is set by the parent
                                    onClick={() => {
                                        setOption(item)
                                        setIsOpen(false);
                                    }}
                                >
                                    {item}
                                </li>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
}

export default DropDownSelector;