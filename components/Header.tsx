import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let left = (
    <div className="left">
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          Products
        </a>
      </Link>
      <Link href="/components">
        <a className="bold" data-active={isActive("/components")}>
          Components
        </a>
      </Link>
      <Link href="/stockists">
        <a className="bold" data-active={isActive("/stockists")}>
          Stockists
        </a>
      </Link>
      <Link href="/orders">
        <a className="bold" data-active={isActive("/orders")}>
          Orders
        </a>
      </Link>
      <Link href="/sales">
        <a className="bold" data-active={isActive("/sales")}>
          Sales
        </a>
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;
