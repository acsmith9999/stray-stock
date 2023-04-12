import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type ComponentProps = {
    component_id: string;
    component_name: string;
    stock_amount: string;
}

const Component: React.FC<{ component: ComponentProps }> = ({ component }) => {
    return (
        <div>
            <h2>{component.component_name}</h2>
            <p>{component.stock_amount} in stock</p>
        </div>
    );
};

export default Component;