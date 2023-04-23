import React, {useState} from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import ProductTable, {ProductProps} from "../components/Product"
// pages/index.tsx
import prisma from '../lib/prisma';
import Router from "next/router"
import { useSession, getSession } from "next-auth/react";
import Button from 'react-bootstrap/Button'
import { Form } from "react-bootstrap";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.products.findMany();
  return { 
    props: {
      body: JSON.stringify(feed, (_key, value) => 
          typeof value === 'bigint'
              ? value.toString()
              : value
      )},
    revalidate: 10 
  }
}

type Props = {
  body: string
}

const Blog: React.FC<Props> = (props) => {

  const {data: session} = useSession();

  const [pname, setPName] = useState('');
  const [pstock, setPStock] = useState(0);
  const [pprice, setPPrice] = useState(0);

  const submitNewProduct = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {pname, pstock, pprice};
      await fetch('api/products', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body),
      });
      await Router.push('/');
      setPName("");
      setPStock(0);
      setPPrice(0);
    } catch (error) {
      console.error(error);
    }

  }

  // const feed = JSON.parse(props.body);
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
      <div className="page">
        <h1>Products List</h1>
        <br></br>
        <main>
          <ProductTable products={props.body}/>
        </main>
      </div>


      <div>
        <br></br>
        <Form onSubmit={submitNewProduct} id="newProductForm">

          <h2>Add new product</h2>
          <br></br>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Product name: </Form.Label>
            <Form.Control
              autoFocus
              onChange={(e) => setPName(e.target.value)}
              placeholder="Name"
              type="text"
              value={pname}
              id="pname"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupStock">
            <Form.Label>Stock Amount: </Form.Label>
            <Form.Control
              onChange={(e) => setPStock(parseInt(e.target.value))}
              placeholder="In Stock"
              type="number"
              min="0"
              value={pstock}
              id="pstock"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPrice">
            <Form.Label>Price: </Form.Label>
            <Form.Control
              onChange={(e) => setPPrice(parseFloat(e.target.value))}
              placeholder="Price"
              type="number"
              step="0.01"
              pattern="^\d*(\.\d{0,2})?$"
              value={pprice}
              id="pprice"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Button variant="primary" disabled={!pname || !pstock || !pprice} type="submit" value="Add Product">Add Product</Button>
          </Form.Group>
        </Form>
      </div>


    </Layout>
  )
}

export default Blog