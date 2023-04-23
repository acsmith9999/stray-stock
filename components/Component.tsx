import React, {useState} from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export type ComponentProps = {
    component_id: string;
    component_name: string;
    stock_amount: string;
    price: string;
}

type Props = {
    components: string
}

const ComponentTable: React.FC<Props> = ({ components }) => {
    const feed = JSON.parse(components);

    const [editableRows, setEditableRows] = useState<{ [key: string]: boolean }>({});
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [sortColumn, setSortColumn] = useState<"component_name" | "stock_amount" | "price">("component_name");
    function handleSort(column: "component_name" | "stock_amount" | "price"): void {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortDirection("asc");
            setSortColumn(column);
        }
    }

    const sortedComponents = [...feed].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (sortDirection === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
    });


    async function handleUpdate(componentId: string): Promise<void> {
        const editable = editableRows[componentId];
      
        if (editable) {
          // Retrieve the updated component information from the input fields
          const nameInput = document.getElementById(`name-${componentId}`) as HTMLInputElement;
          const stockInput = document.getElementById(`stock-${componentId}`) as HTMLInputElement;
          const priceInput = document.getElementById(`price-${componentId}`) as HTMLInputElement;
      
          const cname = nameInput.value;
          const cstock = parseInt(stockInput.value);
          const cprice = parseFloat(priceInput.value);
      
          // Make the PUT request to update the component
          const response = await fetch(`/api/update_component/${componentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ componentId, cname, cstock, cprice }),
          });
      
          if (response.ok) {
              // Update the editableRows state to indicate that this row is no longer editable
              setEditableRows({ ...editableRows, [componentId]: false });
              alert("Update Success");
              await Router.push('/components');
          }
        } else {
          // Set this row as editable
          setEditableRows({ ...editableRows, [componentId]: true });
        }
      }
      async function handleDelete(componentId: string) {
        if (editableRows[componentId]) {
            // Handle cancel update logic here
            setEditableRows({ ...editableRows, [componentId]: false });
        } else {
            // Implement the delete logic here
            if(confirm("Are you sure you want to delete?")){
              const response = await fetch(`/api/components/${componentId}`, {
              method: 'DELETE',
              });
              Router.push('/components');
            }
        }
    };

    async function handleRowClick(componentId: string) {
        await Router.push(`/component_view/${componentId}`);
      }

    return (
        <Table striped bordered hover>
        <thead>
            <tr>
                <th onClick={() => handleSort("component_name")}>Name</th>
                <th onClick={() => handleSort("stock_amount")}>Stock</th>
                <th onClick={() => handleSort("price")}>Price</th>
            </tr>
        </thead>
        <tbody>
            {sortedComponents.map((component) => (
                <tr key={component.component_id} id={`row-${component.component_id}`} >
                    <td className="listLink" onClick={() => handleRowClick(component.component_id)}>
                        {editableRows[component.component_id] ? (
                            <input type="text" defaultValue={component.component_name} id={`name-${component.component_id}`}/>
                        ) : (
                            component.component_name
                        )}
                    </td>
                    <td>
                        {editableRows[component.component_id] ? (
                            <input type="number" defaultValue={component.stock_amount} id={`stock-${component.component_id}`}/>
                        ) : (
                            component.stock_amount
                        )}
                    </td>
                    <td>
                        {editableRows[component.component_id] ? (
                            <input type="number" defaultValue={component.price} id={`price-${component.component_id}`}/>
                        ) : (
                            `$${component.price}`
                        )}
                    </td>
                    <td>
                        <Button variant="warning" onClick={() => handleUpdate(component.component_id)}>
                            {editableRows[component.component_id] ? "Confirm Update" : "Update"}
                        </Button>
                    </td>
                    <td>
                        <Button variant="danger" onClick={() => handleDelete(component.component_id)}>
                            {editableRows[component.component_id] ? "Cancel Update" : "Delete"}
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

export default ComponentTable;