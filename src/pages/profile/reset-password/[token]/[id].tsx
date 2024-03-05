import { GetServerSideProps } from "next";
import { encode } from "querystring";
import { getCollection } from "@/utils/mongo-db/db-client";
import process from "process";
import { useEffect, useRef, useState } from "react";
import { minutesPassed } from "@/utils/time/time";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import styles from "@/styles/ResetPassword.module.css";
import Background from "@/components/Background";

interface Props {
  token: string | null;
  id: string | null;
}
export default function ResetPassword({ token, id }: Props) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const verifyPasswordRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [showingPasswords, setShowingPasswords] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useState<boolean>(false);
  const router = useRouter();

  const changePassword = async () => {
    setStatus("");
    if (!passwordRef.current || !verifyPasswordRef.current) {
      return;
    }
    const { value: password } = passwordRef.current;
    const { value: verifyPassword } = verifyPasswordRef.current;

    if (!password || !verifyPassword) {
      setStatus("Please fill all form fields.");
      return;
    }

    const requestBody = { password, verifyPassword };

    setLoading(true);
    setStatus("Changing your password...");
    const responsePromise = await fetch(`/api/reset/${token}/${id}`, {
      body: JSON.stringify(requestBody),
      method: "POST",
    });

    const response = await responsePromise.json();
    setStatus(response.message);

    if (response.status === 202) {
      setSuccess(true);
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    if (success) {
      setTimeout(async () => {
        await router.push("/login");
      }, 3000);
    }
  }, [success, router]);

  return (
    <>
      <Header />
      <div className={styles.mainDiv}>
        <form>
          <h1 className={styles.title}>Reset Password</h1>
          <div className={styles.formField}>
            <label htmlFor={"password"}> New Password</label>
            <input
              placeholder={"Enter your new password"}
              className={styles.input}
              type={showingPasswords ? "text" : "password"}
              ref={passwordRef}
              id={"password"}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor={"verifyPassword"}>Verify Password</label>
            <input
              placeholder={"Verify your new password"}
              className={styles.input}
              type={showingPasswords ? "text" : "password"}
              id={"verifyPassword"}
              ref={verifyPasswordRef}
            />
          </div>
          <button
            className={styles.button}
            type={"button"}
            onClick={() => setShowingPasswords(!showingPasswords)}
          >
            {showingPasswords ? "Hide Passwords" : "Show Passwords"}
          </button>
          <button
            className={styles.button}
            type={"button"}
            onClick={changePassword}
            disabled={loading || success}
          >
            Change Password
          </button>
          <p>{status}</p>
        </form>
      </div>
      <Background />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params = encode(query);
  console.log(params);
  const token = params
    .split("&")[0]
    .replace("token=", "")
    .replaceAll("%24", "$");
  const id = params.split("&")[1].replace("id=", "");

  const collection = await getCollection(
    String(process.env.TOKENS_COLLECTION_NAME),
  );
  const authToken = await collection.findOne({ token: token });
  if (!authToken || minutesPassed(authToken.date) > 10) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id: id,
      token: token,
    },
  };
};
