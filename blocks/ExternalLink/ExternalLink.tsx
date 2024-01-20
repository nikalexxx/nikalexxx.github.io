import { Component } from "parvis";

export const ExternalLink = Component<JSX.IntrinsicElements["a"]>(
    "ExternalLink",
    () => {
        return ({ children, ...props }) => (
            <a target={"_blank"} rel={["noopener", "noreferrer"].join(' ')} {...props}>
                {children ?? props.href}
            </a>
        );
    }
);
