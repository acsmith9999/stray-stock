import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
// pages/p/[id].tsx
import prisma from '../../lib/prisma';
import Router from 'next/router';
import { ProductProps } from "../../components/Product";


// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const post = {
//     id: "1",
//     title: "Prisma is the perfect ORM for Next.js",
//     content: "[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!",
//     published: false,
//     author: {
//       name: "Nikolas Burk",
//       email: "burk@prisma.io",
//     },
//   }
//   return {
//     props: post,
//   }
// }
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const product = await prisma.products.findUnique({
    where: {
      product_id: parseInt(String(params?.id)),
    }
  });
  return {
    props: product,
  };
};

async function updateProduct(id: string): Promise<void> {
  await fetch('/api/update_product/${id}', {
    method: 'PUT',
  });
  await Router.push('/');
}

// const Post: React.FC<PostProps> = (props) => {
//   let title = props.title
//   if (!props.published) {
//     title = `${title} (Draft)`
//   }

//   return (
//     <Layout>
//       <div>
//         <h2>{title}</h2>
//         <p>By {props?.author?.name || "Unknown author"}</p>
//         <ReactMarkdown children={props.content} />
//       </div>
//       <style jsx>{`
//         .page {
//           background: white;
//           padding: 2rem;
//         }

//         .actions {
//           margin-top: 2rem;
//         }

//         button {
//           background: #ececec;
//           border: 0;
//           border-radius: 0.125rem;
//           padding: 1rem 2rem;
//         }

//         button + button {
//           margin-left: 1rem;
//         }
//       `}</style>
//     </Layout>
//   )
// }

// export default Post
