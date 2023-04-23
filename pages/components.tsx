import React, { useState } from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import ComponentTable, {ComponentProps} from "../components/Component"
// pages/index.tsx
import prisma from '../lib/prisma';
import Router from "next/router"
import { useSession, getSession } from "next-auth/react";
import Button from 'react-bootstrap/Button'
import { Form } from "react-bootstrap";


export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.components.findMany();
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
  const [cname, setCName] = useState('');
  const [cstock, setCStock] = useState(0);
  const [cprice, setCPrice] = useState(0);

  const submitNewComponent = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {cname, cstock, cprice};
      await fetch('api/components', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body),
      });
      await Router.push('/components');
      setCName("");
      setCStock(0);
      setCPrice(0);
    } catch (error) {
      console.error(error);
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
      <div className="page">
        <h1>Components List</h1>
        <br></br>
        <main>
          <ComponentTable components={props.body}/>
        </main>
      </div>
      <div>
        <br></br>
        <Form onSubmit={submitNewComponent} id="newComponentForm">

          <h2>Add new component</h2>
          <br></br>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Component name: </Form.Label>
            <Form.Control
              autoFocus
              onChange={(e) => setCName(e.target.value)}
              placeholder="Name"
              type="text"
              value={cname}
              id="cname"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupStock">
            <Form.Label>Stock Amount: </Form.Label>
            <Form.Control
              onChange={(e) => setCStock(parseInt(e.target.value))}
              placeholder="In Stock"
              type="number"
              min="0"
              value={cstock}
              id="cstock"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPrice">
            <Form.Label>Price: </Form.Label>
            <Form.Control
              onChange={(e) => setCPrice(parseFloat(e.target.value))}
              placeholder="Price"
              type="number"
              step="0.01"
              pattern="^\d*(\.\d{0,2})?$"
              value={cprice}
              id="cprice"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Button variant="primary" disabled={!cname || !cstock || !cprice} type="submit" value="Add Component">Add Component</Button>
          </Form.Group>
        </Form>
      </div>

    </Layout>
  )
}

export default Blog