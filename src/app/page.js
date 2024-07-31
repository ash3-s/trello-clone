"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { googleProvider } from "./config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { Handlelogin } from "./config/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import "./login.css";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

const Signup = ({ component: Component, ...rest }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();
  const auth = getAuth();
  const userr = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/tasks");
      }
    });
    return unsubscribe;
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      if (!(value.includes("@") && value.includes(".com"))) {
        setEmail(value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Email must contain "@" symbol and ".com"',
        }));
      } else {
        setEmail(value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }
    if (name === "password") {
      if (value.length < 8) {
        setPassword(value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Password must contain at least 8 characters",
        }));
      } else {
        setPassword(value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }
  };

  const signIn = async (e) => {
    if (!(formErrors.email || formErrors.password)) {
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/tasks");
        Handlelogin();
      } catch (error) {
        alert("Invalid login credentials!");
        console.error();
      }
    } else {
      alert("Invalid login credentials!");
    }
  };

  const signInWithGoogle = async (e) => {
    if (!(formErrors.email || formErrors.password)) {
      e.preventDefault();
      try {
        await signInWithPopup(auth, googleProvider);
        router.push("/tasks");
        Handlelogin();
      } catch (err) {
        alert("Invalid login credentials!");
        console.error(err);
      }
    } else {
      alert("Invalid login credentials!");
    }
  };

  const navigatetohome = () => {
    // navigate("/");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logodivv h1" onClick={navigatetohome}>
          <EventNoteIcon />
        </div>
      </nav>
      <div className="login-box">
        <p>Sign Up</p>
        <form>
          <div className="user-box">
            <input
              required=""
              name="email"
              type="text"
              placeholder="Enter email"
              onChange={handleInputChange}
            />
            {formErrors.email && (
              <div className="sppan">
                <span>{formErrors.email}</span>
              </div>
            )}
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              required=""
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
            />
            <label>Password</label>
            {formErrors.password && (
              <div className="sppan">
                <span>{formErrors.password}</span>
              </div>
            )}
          </div>
          <button className="btttn" onClick={signIn}>
            Submit
          </button>
          <div className="bttn">
            <button onClick={signInWithGoogle}>
              <GoogleIcon /> Sign up with Google
            </button>
          </div>
        </form>
        <p>
          Already have an account?
          <Link href="/login" className="signup">
            {" "}
            Login!
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
