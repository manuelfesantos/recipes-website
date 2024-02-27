import styles from "@/styles/Login.module.css";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { User, UserCredentials } from "@/types/user";
import { setCookie } from "cookies-next";

interface Props {
  handleSignup: (user: User) => Promise<Response>;
}

export default function SignupForm({ handleSignup }: Props) {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const password2 = useRef<HTMLInputElement>(null);

  const [formFilled, setFormFilled] = useState<boolean>(false);
  const [userValid, setUserValid] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const router = useRouter();

  const signup = async () => {
    if (!username.current || !password.current || !password2.current) {
      return;
    }
    if (
      !username.current.value ||
      !password.current.value ||
      !password2.current.value
    ) {
      setFormFilled(false);
      return;
    }
    setFormFilled(true);
    if (password.current.value !== password2.current.value) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    const user: User = {
      username: username.current.value,
      password: password.current.value,
      recipes: [],
    };
    const responsePromise = await handleSignup(user);

    const response = await responsePromise.json();
    if (response.status === 201) {
      setUserValid(true);
      setCookie("user", response.user._id);
      setTimeout(async () => await router.push("/profile"), 2000);
    } else if (response.status === 400) {
      setUserValid(false);
    }
  };

  return (
    <form className={styles.loginForm}>
      <h1 className={styles.title}>Signup</h1>
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
      <div className={styles.formField}>
        <label htmlFor={"password2"}>Confirm Password</label>
        <input
          className={styles.input}
          type={"password"}
          id={"password2"}
          ref={password2}
          placeholder={"Re-enter your password"}
        />
      </div>
      <button type={"button"} onClick={signup}>
        Signup
      </button>
      <div className={styles.options}>
        <h3 onClick={() => router.push("/login")}>
          {"Already have an account?"}
        </h3>
      </div>
      {!formFilled && (
        <p className={styles.signupMessage}>Please fill all fields</p>
      )}
      {formFilled && !passwordsMatch && (
        <p className={styles.signupMessage}>Passwords do not match</p>
      )}
      {formFilled && passwordsMatch && !userValid && (
        <p className={styles.signupMessage}>Username already exists</p>
      )}
      {formFilled && passwordsMatch && userValid && (
        <p className={styles.signupMessage}>User created successfully</p>
      )}
    </form>
  );
}
