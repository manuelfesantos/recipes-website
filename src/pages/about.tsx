import Head from "next/head";
import Header from "@/components/Header";
import styles from "@/styles/About.module.css";
import Background from "@/components/Background";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.mainDiv}>
        <div className={styles.aboutDiv}>
          <div className={styles.profilePic}></div>
          <h1>Hi there!</h1>
          <h3 className={styles.light}>
            {
              "My name is Manuel Fé Santos and I'm the developer of The Recipes Website"
            }
          </h3>
          <h4 className={styles.light}>
            {"In this website you'll be able to search for recipes,"}
            <br />
            create an account and save your favorite ones.
          </h4>
          <h4 className={styles.light}>
            This website was developed with Next.js and the Edamam Recipes API
            <br />
            and has integration with multiple other services, like MongoDB and
            Cloudflare R2.
          </h4>
          <h4 className={styles.light}>
            My main goal with this project was to practice the technologies
            <br />
            and experiment with different Javascript libraries for encryption,
            HTTP request handling, <br />
            sending emails and much more...
          </h4>
          <h4 className={styles.light}>
            {"This is an open source project, and therefore you'll be able to"}
            <br />
            check the sourcecode of this website in my github repository page.
          </h4>
          <h3>Where you can find me</h3>
          <div className={styles.links}>
            <Link
              href={"https://www.github.com/manuelfesantos/recipes-website"}
              target={"_blank"}
            >
              <img src={"/github-logo.png"} />
            </Link>
            <Link
              href={"https://www.linkedin.com/in/manuelfesantos/"}
              target={"_blank"}
            >
              <img src={"/linkedin-logo.png"} />
            </Link>
          </div>
        </div>
      </div>
      <Background />
    </>
  );
}
