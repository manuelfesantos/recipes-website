import styles from "@/styles/Login.module.css";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { UserCredentials } from "@/types/user";
import { setCookie } from "cookies-next";

interface Props {
  handleLogin: (credentials: UserCredentials) => Promise<Response>;
}

export default function LoginForm({ handleLogin }: Props) {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [formFilled, setFormFilled] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);
  const router = useRouter();

  const login = async () => {
    if (!username.current || !password.current) {
      return;
    }

    if (!username.current.value || !password.current.value) {
      setFormFilled(false);
      return;
    }

    setFormFilled(true);

    const userCredentials: UserCredentials = {
      username: username.current.value,
      password: password.current.value,
    };

    const responsePromise = await handleLogin(userCredentials);

    const response = await responsePromise.json();
    if (response.status === 200) {
      setFormValid(true);
      setCookie("user", response.user._id);
      router.back();
    } else if (response.status === 404 || response.status === 403) {
      setFormValid(false);
    }
  };

  return (
    <form className={styles.loginForm}>
      <h1 className={styles.title}>Login</h1>
      <div className={styles.formField}>
        <label htmlFor={"username"}>Username</label>
        <input
          className={styles.input}
          type={"text"}
          id={"username"}
          ref={username}
          placeholder={"Enter your username"}
        />
      </div>
      <div className={styles.formField}>
        <label htmlFor={"password"}>Password</label>
        <input
          className={styles.input}
          type={"password"}
          id={"password"}
          ref={password}
          placeholder={"Enter your password"}
        />
      </div>
      <button type={"button"} onClick={login}>
        Login
      </button>
      <div className={styles.options}>
        <h3 onClick={() => router.push("/signup")}>
          {"Don't have an account?"}
        </h3>
        <h3>{"Forgot you password?"}</h3>
      </div>
      {!formValid && formFilled && (
        <p className={styles.loginMessage}>Incorrect username or password</p>
      )}
      {!formFilled && (
        <p className={styles.loginMessage}>Please fill all fields</p>
      )}
    </form>
  );
}
