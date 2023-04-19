import React, {useState} from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import ProductTable, {ProductProps} from "../components/Product"
// pages/index.tsx
import prisma from '../lib/prisma';
import Router from "next/router"
import { useSession, getSession } from "next-auth/react";

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
      await fetch('api/post', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body),
      });
      await Router.push('/');
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
        <main>
          <ProductTable products={props.body}/>
        </main>
      </div>


      <div>
        <form onSubmit={submitNewProduct}>
          <h2>Add new product</h2>
          <input
            autoFocus
            onChange={(e) => setPName(e.target.value)}
            placeholder="Name"
            type="text"
            value={pname}
          />
          <input
            onChange={(e) => setPStock(parseInt(e.target.value))}
            placeholder="In Stock"
            type="number"
            value={pstock}
          />
          <input
            onChange={(e) => setPPrice(parseFloat(e.target.value))}
            placeholder="Price"
            type="number"
            value={pprice}
          />
          <input disabled={!pname || !pstock || !pprice} type="submit" value="Add Product" />
        </form>
      </div>

  
    
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }
        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }
        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog