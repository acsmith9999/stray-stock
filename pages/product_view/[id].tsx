import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import Layout from "../../components/Layout"
// pages/p/[id].tsx
import prisma from '../../lib/prisma';
import { Button, Table } from "react-bootstrap";
import Router from "next/router";
import { useSession, getSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const product = await prisma.products.findUnique({
    where: {
      product_id: BigInt(String(params?.id)),
    }
  });
  const productComponents = await prisma.product_components.findMany({where: {
    product_id: BigInt(String(params?.id))
  },
    include: {components:true}})

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
),}
  }
}

type Props = {
  product: string
  productComponents: { components: {component_name: string} } & any
}



const ProductDetail: React.FC<Props> = ({product, productComponents}) => {
  const {data: session} = useSession();
  const parsedProduct = JSON.parse(product);
  const parsedComponents = JSON.parse(productComponents);

  let pname = parsedProduct.product_name

  // Calculate total cost of all components
  const totalCost = parsedComponents.reduce((accumulator, component) => {
    return accumulator + (component.components.price * component.component_quantity)
  }, 0)
  const profit = parseFloat((parsedProduct.price - totalCost.toFixed(2)).toFixed(2));

  async function handleClick(componentId: string) {
    await Router.push(`/component_view/${componentId}`);
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
                    <li className="listLink" key={component.components.component_name} onClick={() => handleClick(component.components.component_id)}>
                      {component.component_quantity} x {component.components.component_name} = ${component.components.price * component.component_quantity}
                    </li>
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

export default ProductDetail
