import * as React from "react";
import classNames from "classnames";
import "./Switch.scss";

export enum Size {
    Small = "switch-small",
    Medium = "switch-medium",
    Large = "switch-large"
}

export interface ISwitchProperties {
    /** inital state value */
    checked?: boolean;
    /** Handles toggle change state */
    handleOnChange?: (checked: boolean) => void;
    /** Disables select picker */
    isDisabled?: boolean;
    /** Set the toggle size small, medium or large omitted (meaning small) */
    size?: Size;
}

const Switch: React.FC<ISwitchProperties> = ({
    checked = false,
    handleOnChange = () => {},
    isDisabled,
    size = Size.Medium
}: ISwitchProperties) => {
    const slider = classNames({
        slider: true,
        [size]: true,
        disabled: isDisabled
    });

    return (
        <>
            <input
                className="slider-input"
                type="checkbox"
                checked={checked}
                readOnly
            />
            <span
                onClick={() => !isDisabled && handleOnChange(!checked)}
                className={slider}
            />
        </>
    );
};

export default Switch;
