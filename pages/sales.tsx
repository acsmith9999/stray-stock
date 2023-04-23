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


type Props = {
  body: string
}

const Sales: React.FC<Props> = (props) => {
    const {data: session} = useSession();
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
        <h1>Coming soon...</h1>
    </Layout>
  )
}

export default Sales