import React, { useState } from "react";
import Switch, { Size } from "../Switch";
import "./DocExamples.scss";

export const BasicUsage = () => {
    const [checked, setChecked] = useState(false);

    return (
        <div className="switch-examples">
            <Switch
                size={Size.Small}
                checked={checked}
                handleOnChange={state => setChecked(state)}
            />
            <div>Small size switcher</div>

            <Switch
                size={Size.Medium}
                checked={checked}
                handleOnChange={state => setChecked(state)}
            />
            <div>Medium size switcher</div>

            <Switch
                size={Size.Large}
                checked={checked}
                handleOnChange={state => setChecked(state)}
            />
            <div>Large size switcher</div>
        </div>
    );
};
