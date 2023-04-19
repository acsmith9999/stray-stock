import React, {useState, useEffect} from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import getServerSideProps from "../pages/api/update_product/[id]";

export type ProductProps = {
    product_id: string;
    product_name: string;
    stock_amount: string;
    price: string;
}


type Props = {
    products: string
}

const ProductTable: React.FC<Props> = ({ products }) => {
    const feed = JSON.parse(products);
    const [editableRows, setEditableRows] = useState<{ [key: string]: boolean }>({});

    async function handleUpdate(productId: string): Promise<void> {
      const editable = editableRows[productId];
    
      if (editable) {
        // Retrieve the updated product information from the input fields
        const nameInput = document.getElementById(`name-${productId}`) as HTMLInputElement;
        const stockInput = document.getElementById(`stock-${productId}`) as HTMLInputElement;
        const priceInput = document.getElementById(`price-${productId}`) as HTMLInputElement;
    
        const pname = nameInput.value;
        const pstock = parseInt(stockInput.value);
        const pprice = parseFloat(priceInput.value);
    
        // Make the PUT request to update the product
        const response = await fetch(`/api/update_product/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, pname, pstock, pprice }),
        });
    
        if (response.ok) {
            // Retrieve the updated product data from the server
            // const updatedProductResponse = await fetch(`/api/products/${productId}`);
            // const updatedProduct = await updatedProductResponse.json();

            // // Update the corresponding row in the table with the new data
            // const row = document.getElementById(`row-${productId}`);
            // const nameCell = row.querySelector(`#name-${productId}`) as HTMLTableCellElement;
            // const stockCell = row.querySelector(`#stock-${productId}`) as HTMLTableCellElement;
            // const priceCell = row.querySelector(`#price-${productId}`) as HTMLTableCellElement;

            // nameCell.textContent = updatedProduct.product_name;
            // stockCell.textContent = updatedProduct.stock_amount.toString();
            // priceCell.textContent = updatedProduct.price.toString();

            // Update the editableRows state to indicate that this row is no longer editable
            setEditableRows({ ...editableRows, [productId]: false });
            alert("Success");
        }
      } else {
        // Set this row as editable
        setEditableRows({ ...editableRows, [productId]: true });
      }
    }

  const handleDelete = (productId: string) => {
      if (editableRows[productId]) {
          // Handle cancel update logic here
          setEditableRows({ ...editableRows, [productId]: false });
      } else {
          // Implement the delete logic here
      }
  };
    return (
      <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            {feed.map((product) => (
                <tr key={product.product_id} id={`row-${product.product_id}`}>
                    <td>
                        {editableRows[product.product_id] ? (
                            <input type="text" defaultValue={product.product_name} id={`name-${product.product_id}`}/>
                        ) : (
                            product.product_name
                        )}
                    </td>
                    <td>
                        {editableRows[product.product_id] ? (
                            <input type="number" defaultValue={product.stock_amount} id={`stock-${product.product_id}`}/>
                        ) : (
                            product.stock_amount
                        )}
                    </td>
                    <td>
                        {editableRows[product.product_id] ? (
                            <input type="number" defaultValue={product.price} id={`price-${product.product_id}`}/>
                        ) : (
                            `$${product.price}`
                        )}
                    </td>
                    <td>
                        <button onClick={() => handleUpdate(product.product_id)}>
                            {editableRows[product.product_id] ? "Confirm Update" : "Update"}
                        </button>
                    </td>
                    <td>
                        <button onClick={() => handleDelete(product.product_id)}>
                            {editableRows[product.product_id] ? "Cancel Update" : "Delete"}
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    );
  };

export default ProductTable;