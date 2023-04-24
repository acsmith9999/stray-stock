import React, { Component } from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import Layout from "../../components/Layout"
// pages/p/[id].tsx
import prisma from '../../lib/prisma';
import { Button, Table } from "react-bootstrap";
import Router from "next/router";
import { useSession, getSession } from "next-auth/react";
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const product = await prisma.products.findUnique({
    where: {
      product_id: BigInt(String(params?.id)),
    }
  });
  const productComponents = await prisma.product_components.findMany({where: {
    product_id: BigInt(String(params?.id))
  },
    include: {components:true}});
  const allComponents = await prisma.components.findMany();

  return { 
    props: {
      product: JSON.stringify(product, (_key, value) => 
          typeof value === 'bigint'
              ? value.toString()
              : value
      ),
    productComponents: JSON.stringify(productComponents, (_key, value) => 
    typeof value === 'bigint'
        ? value.toString()
        : value
),
    allComponents: JSON.stringify(allComponents, (_key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value)
    }
  }
}

type Props = {
  product: string
  productComponents: { components: {component_name: string} } & any
  allComponents: any,
}

type SelectorProps = {
  items: Array<{ id: number; component_name: string; disabled?: boolean }>
  selectedItems: Array<{ id: number; component_name: string }>
  onChange: (selectedItems: Array<{ component_id: number; component_name: string }>) => void
}
class Selector extends Component<SelectorProps> {
  render() {
    const { items, selectedItems, onChange } = this.props
    
    return (
      <MultiSelect
        items={items}
        selectedItems={selectedItems}
        onChange={onChange}
      />
    )
  }
}

const ProductDetail: React.FC<Props> = ({product, productComponents, allComponents}) => {
  const {data: session} = useSession();
  const parsedProduct = JSON.parse(product);
  const parsedComponents = JSON.parse(productComponents);

  const parsedSelectedItems = parsedComponents.map((component) => ({
    id: component.component_id,
    label: component.components.component_name,
  }));

  const [selectedItems, setSelectedItems] = React.useState(parsedSelectedItems);

  const [toCreate, setToCreate] = React.useState([]);

  const [toDelete, setToDelete] = React.useState([]);

  const parsedAllComponentsFull = JSON.parse(allComponents);
  const parsedAllComponents = parsedAllComponentsFull.map((component) => ({
    id: component.component_id,
    label: component.component_name,
  }));

  let pname = parsedProduct.product_name

  // Calculate total cost of all components
  const totalCost = parsedComponents.reduce((accumulator, component) => {
    return accumulator + (component.components.price * component.component_quantity)
  }, 0)
  const profit = parseFloat((parsedProduct.price - totalCost.toFixed(2)).toFixed(2));

  async function handleClick(componentId: string) {
    await Router.push(`/component_view/${componentId}`);
  }

  function handleSelectedItemsChange(selectedItems){
    setSelectedItems(selectedItems);
    setToCreate(selectedItems.filter(item => {
      return !parsedSelectedItems.some(parsedItem => {
        return parsedItem.id === item.id && parsedItem.label === item.label;
      });
    }))

    setToDelete(parsedSelectedItems.filter(item => {
      return !selectedItems.some(parsedItem => {
        return parsedItem.id === item.id && parsedItem.label === item.label;
      });
    }))
  }

  async function handleApplyLinkedComponents(){
    toCreate.forEach((item) => {
      submitNewProdComp(item);
    })

    toDelete.forEach((item)=>{
      deleteProdComp(item);
    })
  }

  const submitNewProdComp = async (item) => {
    try{
      let pid = parsedProduct.product_id;
      let cid = item.id;
      const body = {pid, cid};
      await fetch('../api/product_components', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }
    await Router.push(`/product_view/${parsedProduct.product_id}`);
  }

  async function deleteProdComp(item) {
    try {
      let pid = parsedProduct.product_id;
      let cid = item.id;
      const body = {pid, cid};
      await fetch('../api/product_components/deleteProdComp', {
        method:'DELETE',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(body)
      });
    }
    catch (error){
      console.log(error);
    }
    await Router.push(`/product_view/${parsedProduct.product_id}`);
  }

  async function handleUpdateProdComp(cid: string): Promise<void>{
    const amountInput = document.getElementById(`amount-${cid}`) as HTMLInputElement;
    const amount = parseInt(amountInput.value);
    const pid = parsedProduct.product_id;

    const response = await fetch('../api/product_components/updateProdComp', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({cid, pid, amount}),
    });
    if (response.ok){
      alert("Update Success");
      await Router.push(`/product_view/${parsedProduct.product_id}`);
    }
  }


  if (!session) {
    return (
      <Layout>
        <h1>Stray Leaves</h1>
        <div>Please log in to view this page</div>
      </Layout>
    );
  }
    return (
    <Layout>
      <div>
        <h2>{pname}</h2>
        <br></br>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Amount in stock:</td>
              <td>{parsedProduct.stock_amount}</td>
            </tr>
            <tr>
              <td>Price:</td>
              <td>${parsedProduct.price}</td>
            </tr>
            <tr>
              <td>Components:</td>
              <td>
                <ul>
                  {parsedComponents?.map((component) => (
                    <div>
                      <li className="listLink" key={component.components.component_name} onClick={() => handleClick(component.components.component_id)}>
                        {component.component_quantity} x {component.components.component_name} = ${(component.components.price * component.component_quantity).toFixed(2)}
                      </li>
                      <input id={`amount-${component.components.component_id}`} type="number" min="0" defaultValue={component.component_quantity}></input>
                      <Button onClick={() => handleUpdateProdComp(component.components.component_id)}>Update</Button>
                    </div>
                  ))}
                </ul>
              </td>
            </tr>
            <tr>
              <td>Total cost to make:</td>
              <td>${totalCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Profit margin:</td>
              <td style={{color: profit >= 0 ? 'green' : 'red'}}>${profit}</td>
            </tr>
          </tbody>

        </Table>
        <br></br>
        <div>
          <h3>Link another component:</h3>
          <br></br>
          <Selector
            items={parsedAllComponents}
            selectedItems={selectedItems}
            onChange={handleSelectedItemsChange} />
          <br></br>
          <Button onClick={handleApplyLinkedComponents}>Apply changes</Button>
        </div>
        <br></br>

      </div>
      <style jsx>{`
        .listLink:hover {
          color: blue;
          cursor: pointer;
          text-decoration: underline;
        }`}
          </style>
    </Layout>
  )
}

export default ProductDetail
