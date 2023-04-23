import React, {useState, useEffect} from "react";
import Router from "next/router";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export type ProductProps = {
    product_id: string;
    product_name: string;
    stock_amount: string;
    price: string;
    product_components: [];
}


type Props = {
    products: string
}

const ProductTable: React.FC<Props> = ({ products }) => {
    const feed = JSON.parse(products);
    const [editableRows, setEditableRows] = useState<{ [key: string]: boolean }>({});
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [sortColumn, setSortColumn] = useState<"product_name" | "stock_amount" | "price">("product_name");
    function handleSort(column: "product_name" | "stock_amount" | "price"): void {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortDirection("asc");
            setSortColumn(column);
        }
    }

    const sortedProducts = [...feed].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (sortDirection === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
    });


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
            // Update the editableRows state to indicate that this row is no longer editable
            setEditableRows({ ...editableRows, [productId]: false });
            alert("Update Success");
            await Router.push('/');
        }
      } else {
        // Set this row as editable
        setEditableRows({ ...editableRows, [productId]: true });
      }
    }

  async function handleDelete(productId: string) {
      if (editableRows[productId]) {
          // Handle cancel update logic here
          setEditableRows({ ...editableRows, [productId]: false });
      } else {
          // Implement the delete logic here
          if(confirm("Are you sure you want to delete?")){
            const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            });
            Router.push('/');
          }
      }
  };

  async function handleRowClick(productId: string) {
    await Router.push(`/product_view/${productId}`);
  }


    return (
      <Table striped bordered hover>
        <thead>
            <tr>
                <th onClick={() => handleSort("product_name")}>Name</th>
                <th onClick={() => handleSort("stock_amount")}>Stock</th>
                <th onClick={() => handleSort("price")}>Price</th>
            </tr>
        </thead>
        <tbody>
            {sortedProducts.map((product) => (
                <tr key={product.product_id} id={`row-${product.product_id}`} >
                {/* <tr key={product.product_id} id={`row-${product.product_id}`}> */}
                    <td className="listLink" onClick={() => handleRowClick(product.product_id)}>
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
                        <p>{product.product_components}</p>
                    </td>
                    <td>
                        <Button variant="warning" onClick={() => handleUpdate(product.product_id)}>
                            {editableRows[product.product_id] ? "Confirm Update" : "Update"}
                        </Button>
                    </td>
                    <td>
                        <Button variant="danger" onClick={() => handleDelete(product.product_id)}>
                            {editableRows[product.product_id] ? "Cancel Update" : "Delete"}
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
        <style jsx>{`
        .listLink:hover {
          color: blue;
          cursor: pointer;
          text-decoration: underline;
        }`}</style>
    </Table>
    );
  };

export default ProductTable;