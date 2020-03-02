import React, { ReactNode, FC, useState, useEffect } from "react";
import ReactDOM from "react-dom";

export interface IWindowProperties {
    /** window directories toolbar */
    directories?:
        | boolean
        | ((windowProps: IWindowProperties, window: Window) => boolean);
    /** window height size */
    height:
        | number
        | ((windowProps: IWindowProperties, window: Window) => number);
    /** window left position */
    left?:
        | number
        | ((windowProps: IWindowProperties, window: Window) => number);
    /** window location bar */
    location?:
        | boolean
        | ((windowProps: IWindowProperties, window: Window) => boolean);
    /** window menu bar */
    menubar?:
        | boolean
        | ((windowProps: IWindowProperties, window: Window) => boolean);
    /** window is resizable */
    resizable?:
        | boolean
        | ((windowProps: IWindowProperties, window: Window) => boolean);
    /** window Scrool Bars */
    scrollbars?:
        | boolean
        | ((windowProps: IWindowProperties, window: Window) => boolean);
    /** window toolbar */
    toolbar?:
        | boolean
        | ((windowProps: IWindowProperties, window: Window) => boolean);
    /** window top position */
    top?: number | ((windowProps: IWindowProperties, window: Window) => number);
    /** window width size */
    width:
        | number
        | ((windowProps: IWindowProperties, window: Window) => number);
}

export interface IPortalWindowProperties {
    /** Close window when parent is closed */
    autoClose?: boolean;
    /** Window content */
    children: ReactNode;
    /** Function called when the window is closed */
    onClose?: () => void;
    /** The title of the window */
    title: string;
    /** Window Properties */
    windowProps?: IWindowProperties;
}

const PortalWindow: FC<IPortalWindowProperties> = ({
    autoClose = false,
    children,
    onClose = () => {},
    title = "New Window",
    windowProps = {
        directories: false,
        height: 400,
        left: (windowProps: IWindowProperties, window: Window) => {
            // Place the portal window horizontally at the center
            let portalWindowHeight = 0;

            if (typeof windowProps.width === "function") {
                portalWindowHeight = windowProps.width.call(
                    self,
                    windowProps,
                    window
                );
            } else {
                portalWindowHeight = windowProps.width / 2;
            }

            return window.screen.width / 2 - portalWindowHeight;
        },
        location: false,
        menubar: false,
        resizable: true,
        scrollbars: true,
        toolbar: false,
        top: (windowProps: IWindowProperties, window: Window) => {
            // Place the portal window vertically at the center
            let portalWindowHeight = 0;

            if (typeof windowProps.height === "function") {
                portalWindowHeight = windowProps.height.call(
                    self,
                    windowProps,
                    window
                );
            } else {
                portalWindowHeight = windowProps.height / 2;
            }

            return window.screen.height / 2 - portalWindowHeight;
        },
        width: 400
    }
}: IPortalWindowProperties) => {
    const [portalWindow, setPortalWindow] = useState();
    const container: HTMLDivElement = document.createElement("div");

    useEffect(() => {
        setPortalWindow((window as any).open("", "", windowPropsToString()));
    }, []);

    useEffect(() => {
        if (portalWindow != null) {
            copyStyles(document, portalWindow.document);
            portalWindow.document.body.appendChild(container);
            portalWindow.document.title = title || "A React portal window";
            portalWindow.addEventListener("beforeunload", () => {
                onClose();
            });

            autoClose && window.addEventListener("unload", closePortalWindow);

            return function cleanup() {
                portalWindow.close();
            };
        }
    }, [portalWindow]);

    /**
     * Closes Portal window when parent is closed
     *
     */
    const closePortalWindow = () => {
        if (portalWindow && !portalWindow.closed) {
            portalWindow.close();
        }
    };

    /**
     * Copy css styles from origin document into the portal window
     *
     * @param {*} sourceDoc
     * @param {*} targetDoc
     */
    const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
        Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
            if ((styleSheet as CSSStyleSheet).cssRules) {
                // true for inline styles
                const newStyleEl = targetDoc.createElement("style");

                Array.from((styleSheet as CSSStyleSheet).cssRules).forEach(
                    cssRule => {
                        newStyleEl.appendChild(
                            targetDoc.createTextNode(cssRule.cssText)
                        );
                    }
                );

                targetDoc.head.appendChild(newStyleEl);
            } else if (styleSheet.href) {
                // true for stylesheets loaded from a URL
                const newLinkEl = targetDoc.createElement("link");

                newLinkEl.rel = "stylesheet";
                newLinkEl.href = styleSheet.href;
                targetDoc.head.appendChild(newLinkEl);
            }
        });
    };

    /**
     * Convert the portal window properties object to a string
     *
     * @returns {string}
     */
    const windowPropsToString = (): string => {
        return Object.entries(windowProps).reduce((acc, [key, value]) => {
            switch (typeof value) {
                case "function":
                    return `${acc}, ${key}=${value.call(
                        self,
                        windowProps,
                        window
                    )}`;
                case "boolean":
                    return `${acc}, ${key}=${value ? "yes" : "no"}`;
                default:
                    return `${acc}, ${key}=${value}`;
            }
        }, "");
    };

    return (
        <>{!portalWindow ? null : ReactDOM.createPortal(children, container)}</>
    );
};

export default PortalWindow;
