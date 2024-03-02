import styles from "@/styles/Header.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
export default function Header() {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(false);
  useEffect(() => {
    const user = getCookie("user");
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className={styles.header}>
      <ul className={styles.navBar}>
        <li>
          <Link href={"/"}>Recipes</Link>
        </li>
        <li>
          <Link href={"/about"}>About</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <Link href={"/profile"}>Profile</Link>
          </li>
        ) : (
          <li>
            <Link href={"/login"}>Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
