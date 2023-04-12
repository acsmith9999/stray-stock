import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type ProductProps = {
    product_id: string;
    product_name: string;
    stock_amount: string;
    price: string;
}

const Product: React.FC<{ product: ProductProps }> = ({ product }) => {
    return (
        <div>
            <h2>{product.product_name}</h2>
            <p>{product.stock_amount} in stock</p>
            <p>${product.price} ppu</p>
        </div>
    );
};

export default Product;