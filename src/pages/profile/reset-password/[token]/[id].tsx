import { GetServerSideProps } from "next";
import { encode } from "querystring";
import { getCollection } from "@/utils/mongo-db/db-client";
import process from "process";
import { useRef, useState } from "react";
import { minutesPassed } from "@/utils/time/time";
import { useRouter } from "next/router";
import Header from "@/components/Header";

interface Props {
  token: string | null;
  id: string | null;
}
export default function ResetPassword({ token, id }: Props) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const verifyPasswordRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
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

    const responsePromise = await fetch(`/api/reset/${token}/${id}`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const response = await responsePromise.json();

    if (response.status === 202) {
      await router.push("/login");
    }
    setStatus(response.message);
  };

  return (
    <>
      <Header />
      <form>
        <label htmlFor={"password"}> New Password</label>
        <input type={"password"} ref={passwordRef} id={"password"} />
        <label htmlFor={"verifyPassword"}>Verify Password</label>
        <input
          type={"password"}
          id={"verifyPassword"}
          ref={verifyPasswordRef}
        />
        <button type={"button"} onClick={changePassword}>
          Change Password
        </button>
        <p>{status}</p>
      </form>
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
      token: token,
      id: id,
    },
  };
};
