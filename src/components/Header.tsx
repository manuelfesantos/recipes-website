import styles from "@/styles/Header.module.css";
import Link from "next/link";
export default function Header() {
  return (
    <div className={styles.header}>
      <ul className={styles.navBar}>
        <li>
          <Link href={"/"}>Recipes</Link>
        </li>
        <li>
          <Link href={"/profile"}>Profile</Link>
        </li>
        <li>
          <Link href={"/about"}>About</Link>
        </li>
      </ul>
    </div>
  );
}
