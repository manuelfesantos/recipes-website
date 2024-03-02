import styles from "@/styles/ForgotPassword.module.css";
import { useRef, useState } from "react";
import Header from "@/components/Header";

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
    setValidEmail((prevState) => emailIsEmailPattern);
    if (!usernameIsAlphaNumeric || !emailIsEmailPattern) return;

    setLoading(true);

    const requestBody = {
      username: usernameValue,
      email: emailValue,
    };
    const responsePromise = await fetch("/api/reset/password", {
      method: "POST",
      body: JSON.stringify(requestBody),
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
      <div className={styles.headersDiv}>
        <h1 className={styles.mainHeader}>Forgot your password?</h1>
        <h2 className={styles.secondHeader}>
          {"Don't worry, we've all been through that"}
        </h2>
        <h3 className={styles.thirdHeader}>
          Please enter your username and email address
        </h3>
        <h3 className={styles.thirdHeader}>
          so that we can help you to reset your password
        </h3>
      </div>
      <form>
        <label>Username</label>
        <input type={"text"} id={"username"} ref={username} />
        <label>Email</label>
        <input type={"email"} id={"email"} ref={email} />
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
      </form>
    </>
  );
}
