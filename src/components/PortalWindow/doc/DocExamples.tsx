import React, { useState } from "react";
import PortalWindow from "../PortalWindow";
import "./DocExamples.scss";

export const BasicUsage = () => {
    const [showPortalWindow, setShowPortalWindow] = useState(false);
    return (
        <>
            {showPortalWindow ? (
                <>
                    <PortalWindow
                        title={"MY WINDOW"}
                        onClose={() => setShowPortalWindow(false)}
                    >
                        <h1 className={"portal-window-title"}>PORTAL WINDOW</h1>
                    </PortalWindow>
                    <button onClick={() => setShowPortalWindow(false)}>
                        Close Portal Window
                    </button>
                </>
            ) : (
                <button onClick={() => setShowPortalWindow(true)}>
                    Open Portal Window
                </button>
            )}
        </>
    );
};
