import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Router from "next/router"
import { FormEventHandler, useState } from "react";
import Layout from "../../components/Layout"

interface Props {}

const SignIn: NextPage = (props): JSX.Element => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // validate your userinfo
    e.preventDefault();

    const res = await signIn("credentials", {
      username: userInfo.username,
      password: userInfo.password,
      redirect: false,
    }
    );

    if(res.ok){
      await Router.push('/');
    }
    console.log(res);
  };
  return (
    <Layout>
      <div className="sign-in-form">
        <form onSubmit={handleSubmit}>
          <h1>Log in</h1>
          <input
            value={userInfo.username}
            onChange={({ target }) =>
              setUserInfo({ ...userInfo, username: target.value })
            }
            type="text"
            placeholder="username"
          />
          <input
            value={userInfo.password}
            onChange={({ target }) =>
              setUserInfo({ ...userInfo, password: target.value })
            }
            type="password"
            placeholder="********"
          />
          <input type="submit" value="Log in" />
        </form>
      </div>
    </Layout>
  );
};

export default SignIn;