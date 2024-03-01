import styles from "@/styles/Login.module.css";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { User } from "@/types/user";
import { setCookie } from "cookies-next";

interface Props {
  handleSignup: (user: User) => Promise<Response>;
}

export default function SignupForm({ handleSignup }: Props) {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const password2 = useRef<HTMLInputElement>(null);
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);

  const [formFilled, setFormFilled] = useState<boolean>(false);
  const [userValid, setUserValid] = useState<boolean>(true);
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [showingPasswords, setShowingPasswords] = useState<boolean>(false);
  const router = useRouter();

  const signup = async () => {
    if (
      !username.current ||
      !password.current ||
      !password2.current ||
      !firstName.current ||
      !lastName.current ||
      !email.current
    ) {
      return;
    }
    if (!formIsFilled()) {
      setFormFilled(false);
      console.log("Form is not filled");
      return;
    }
    setFormFilled(true);

    if (!emailIsValid()) {
      setEmailValid(false);
      return;
    }

    setEmailValid(true);

    if (password.current.value !== password2.current.value) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    setUserValid(true);
    const user: User = {
      username: username.current.value,
      password: password.current.value,
      firstName: firstName.current.value,
      imageUrl: "",
      lastName: lastName.current.value,
      email: email.current.value,
      recipes: [],
    };
    const responsePromise = await handleSignup(user);

    const response = await responsePromise.json();
    if (response.status === 201) {
      setLoaded(true);
      setCookie("user", response.user._id);
      setTimeout(async () => await router.push("/profile"), 2000);
    } else if (response.status === 400) {
      setUserValid(false);
    }
  };

  const formIsFilled = () => {
    return (
      username.current?.value &&
      password.current?.value &&
      password2.current?.value &&
      email.current?.value &&
      firstName.current?.value &&
      lastName.current?.value
    );
  };

  const emailIsValid = () => {
    return email.current?.value.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };

  return (
    <form className={styles.loginForm}>
      <h1 className={styles.title}>Sign Up</h1>
      <div className={styles.formPair}>
        <div className={styles.formField}>
          <label htmlFor={"firstName"}>First Name</label>
          <input
            className={styles.input}
            type={"text"}
            id={"firstName"}
            ref={firstName}
            placeholder={"Enter your first name"}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor={"lastName"}>Last Name</label>
          <input
            className={styles.input}
            type={"text"}
            id={"lastName"}
            ref={lastName}
            placeholder={"Enter your last name"}
          />
        </div>
      </div>
      <div className={styles.formPair}>
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
          <label htmlFor={"email"}>Email</label>
          <input
            className={`${styles.input} ${!emailValid && styles.invalid}`}
            type={"email"}
            id={"email"}
            ref={email}
            placeholder={"Enter your email"}
          />
        </div>
      </div>

      <div className={styles.formPair}>
        <div className={styles.formField}>
          <label htmlFor={"password"}>Password</label>
          <input
            className={`${styles.input} ${!passwordsMatch && styles.invalid}`}
            type={showingPasswords ? "text" : "password"}
            id={"password"}
            ref={password}
            placeholder={"Enter your password"}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor={"password2"}>Confirm Password</label>
          <input
            className={`${styles.input} ${!passwordsMatch && styles.invalid}`}
            type={showingPasswords ? "text" : "password"}
            id={"password2"}
            ref={password2}
            placeholder={"Confirm your password"}
          />
        </div>
      </div>
      <div className={styles.buttonsPair}>
        <button
          type={"button"}
          onClick={() => setShowingPasswords((prevState) => !prevState)}
        >
          {showingPasswords ? "Hide Passwords" : "Show Passwords"}
        </button>
        <button type={"button"} onClick={signup}>
          Signup
        </button>
      </div>
      <div className={styles.options}>
        <h3 onClick={() => router.push("/login")}>
          {"Already have an account?"}
        </h3>
      </div>
      {!formFilled && (
        <p className={styles.signupMessage}>Please fill all fields</p>
      )}
      {formFilled && !emailValid && (
        <p className={styles.signupMessage}>
          Please enter a valid email address
        </p>
      )}
      {formFilled && emailValid && !passwordsMatch && (
        <p className={styles.signupMessage}>Passwords do not match</p>
      )}
      {formFilled && emailValid && passwordsMatch && !userValid && (
        <p className={styles.signupMessage}>Username already exists</p>
      )}
      {formFilled && emailValid && passwordsMatch && userValid && isLoaded && (
        <p className={styles.signupMessage}>User created successfully</p>
      )}
    </form>
  );
}
