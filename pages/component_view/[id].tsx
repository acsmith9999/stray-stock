import React, { Component, useMemo, useState } from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import Layout from "../../components/Layout"
// pages/p/[id].tsx
import prisma from '../../lib/prisma';
import { Table } from "react-bootstrap";
import Router from "next/router";
import { useSession, getSession } from "next-auth/react";
import Button from 'react-bootstrap/Button'
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"


export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const component = await prisma.components.findUnique({
    where: {
      component_id: BigInt(String(params?.id)),
    }
  });
  const productComponents = await prisma.product_components.findMany({where: {
    component_id: BigInt(String(params?.id))
  },
    include: {products:true}});
  const allProducts = await prisma.products.findMany();

    //todo query list of stockists

  return { 
    props: {
      component: JSON.stringify(component, (_key, value) => 
          typeof value === 'bigint'
              ? value.toString()
              : value
      ),
    productComponents: JSON.stringify(productComponents, (_key, value) => 
    typeof value === 'bigint'
        ? value.toString()
        : value
),
    allProducts: JSON.stringify(allProducts, (_key, value) =>
    typeof value === 'bigint'
        ? value.toString()
        : value)
  }
  }
}

type Props = {
  component: string
  productComponents: { products: {product_name: string} } & any
  allProducts: any,
}

type SelectorProps = {
  items: Array<{ id: number; product_name: string; disabled?: boolean }>
  selectedItems: Array<{ id: number; product_name: string }>
  onChange: (selectedItems: Array<{ product_id: number; product_name: string }>) => void
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



const ComponentDetail: React.FC<Props> = ({component,productComponents,allProducts}) => {
  const {data: session} = useSession();

  const parsedComponent = JSON.parse(component);
  const parsedProducts = JSON.parse(productComponents);
  const parsedSelectedItems = parsedProducts.map((product) => ({
    id: product.product_id,
    label: product.products.product_name,
  }))

  const [selectedItems, setSelectedItems] = React.useState(parsedSelectedItems);

  const [toCreate, setToCreate] = React.useState([]);

  const [toDelete, setToDelete] = React.useState([]);

  const parsedAllProductsFull = JSON.parse(allProducts);
  const parsedAllProducts = parsedAllProductsFull.map((product) => ({
    id: product.product_id,
    label: product.product_name,
  }))


  function handleSelectedItemsChange(selectedItems) {
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

  async function handleApplyLinkedProducts(){
    toCreate.forEach((item) => {
      submitNewProdComp(item);
    })

    toDelete.forEach((item) => {
      deleteProdComp(item);
    })
  }

const submitNewProdComp = async (item) => {
  try{
    let pid = item.id;
    let cid = parsedComponent.component_id;
    const body = {pid, cid};
    await fetch('../api/product_components', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  }
  await Router.push(`/component_view/${parsedComponent.component_id}`);
}

async function deleteProdComp(item) {
  try{
    let pid = item.id;
    let cid = parsedComponent.component_id;
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
  await Router.push(`/component_view/${parsedComponent.component_id}`);

}

  async function handleUpdateProdComp(pid: string): Promise<void>{
    //update amount of components used for a product
    const amountInput = document.getElementById(`amount-${pid}`) as HTMLInputElement;
    const amount = parseInt(amountInput.value);
    const cid = parsedComponent.component_id;

    const response = await fetch('../api/product_components/updateProdComp', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({cid, pid, amount}),
    });

    if (response.ok){
      alert("Update Success");
      await Router.push(`/component_view/${parsedComponent.component_id}`);
    }
  }

  async function handleClick(productId: string) {
    await Router.push(`/product_view/${productId}`);
  }

  if (!session) {
    return (
      <Layout>
        <h1>Stray Leaves</h1>
        <div>Please log in to view this page</div>
      </Layout>
    );
  }
    return(
        <Layout>
          <div>
            <h2>{parsedComponent.component_name}</h2>
            <br></br>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Amount in stock:</td>
                  <td>{parsedComponent.stock_amount}</td>
                </tr>
                <tr>
                  <td>Price:</td>
                  <td>{parsedComponent.price}</td>
                </tr>
                <tr>
                  <td>Used in:</td>
                  <td>
                    <ul>
                      {parsedProducts?.map((product) => (
                        <div>
                          <li className="listLink" key={product.products.product_name} onClick={() => handleClick(product.products.product_id)}>
                            {product.products.product_name}: {product.component_quantity}x
                          </li>
                          <input id={`amount-${product.products.product_id}`} type="number" min="0" defaultValue={product.component_quantity}></input>
                          <Button onClick={() => handleUpdateProdComp(product.products.product_id)}>Update</Button>
                        </div>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>Stocked by:</td>
                  <td>To do</td>
                </tr>
              </tbody>
            </Table>
            <br></br>
            <div>
              <h3>Link another product:</h3>
              <br></br>
              <Selector
                // items={parsedAllProducts.map((product) => ({
                //   id: product.product_id,
                //   label: product.product_name,
                // }))}
                items={parsedAllProducts}
                selectedItems={selectedItems}

                onChange={handleSelectedItemsChange}
              />
              <br></br>
              <Button onClick={handleApplyLinkedProducts}>Apply changes</Button>
            </div>
            <br></br>
            <div>
              <h3>Link another stockist:</h3>
              <p>Dropdown menu</p>
              <p>to do</p>
            </div>
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


export default ComponentDetail

