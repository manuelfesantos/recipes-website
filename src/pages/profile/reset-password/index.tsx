import styles from "@/styles/ForgotPassword.module.css";
import { useRef, useState } from "react";
import Header from "@/components/Header";
import Background from "@/components/Background";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const [formValid, setFormValid] = useState<boolean>(true);
  const [validUsername, setValidUsername] = useState<boolean>(true);
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [resetSucceeded, setResetSucceeded] = useState<boolean>(false);
  const [resetFailed, setResetFailed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const resetFormStates = () => {
    setFormValid(true);
    setValidUsername(true);
    setValidEmail(true);
    setLoading(false);
    setResetSucceeded(false);
    setResetFailed(false);
  };
  const sendResetEmail = async () => {
    resetFormStates();

    if (!username.current || !email.current) return;
    const { value: usernameValue } = username.current;
    const { value: emailValue } = email.current;
    if (!usernameValue || !emailValue) {
      setFormValid(false);
      return;
    }
    setFormValid(true);

    const usernameIsAlphaNumeric = /^[A-Za-z0-9]*$/.test(usernameValue);
    const emailIsEmailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
    setValidUsername(usernameIsAlphaNumeric);
    setValidEmail(emailIsEmailPattern);
    if (!usernameIsAlphaNumeric || !emailIsEmailPattern) return;

    setLoading(true);

    const requestBody = {
      email: emailValue,
      username: usernameValue,
    };
    const responsePromise = await fetch("/api/reset/password", {
      body: JSON.stringify(requestBody),
      method: "POST",
    });

    const response = await responsePromise.json();
    setLoading(false);
    if (response.status === 200) {
      setResetSucceeded(true);
    } else {
      setResetFailed(true);
      setErrorMessage(response.message);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.mainDiv}>
        <div className={styles.centerDiv}>
          <div className={styles.headersDiv}>
            <h2>Forgot your password?</h2>
            <p>{"Don't worry, we've all been through that"}</p>
            <p>
              Please enter your username and email address so that we can help
              you to reset your password
            </p>
          </div>
          <form className={styles.form}>
            <div className={styles.formField}>
              <label>Username</label>
              <input
                placeholder={"Enter your username"}
                className={styles.input}
                type={"text"}
                id={"username"}
                ref={username}
              />
            </div>
            <div className={styles.formField}>
              <label>Email</label>
              <input
                placeholder={"Enter your email"}
                className={styles.input}
                type={"email"}
                id={"email"}
                ref={email}
              />
            </div>
            <button type={"button"} onClick={sendResetEmail}>
              Send Email
            </button>
            {!formValid && <p>Please fill all fields of the form</p>}
            {!validUsername && <p>Please provide a valid username</p>}
            {!validEmail && <p>Please provide a valid email</p>}
            {isLoading && <p>Please wait while we process your request...</p>}
            {resetSucceeded && (
              <p>Email was sent successfully! Please check your inbox</p>
            )}
            {resetFailed && <p>{`${errorMessage}`}</p>}
            <h3
              className={styles.back}
              onClick={async () => await router.push("/login")}
            >
              Back to login
            </h3>
          </form>
        </div>
      </div>
      <Background />
    </>
  );
}
