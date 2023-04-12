import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import Component, {ComponentProps} from "../components/Component"
// pages/index.tsx
import prisma from '../lib/prisma';


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
  const feed = JSON.parse(props.body);
  return (
    <Layout>
      <div className="page">
        <h1>Components List</h1>
        <main>
          {feed.map((component) => (
            <div key={component.component_id} className="post">
              <Component component={component} />
            </div>
          ))}
        </main>
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