"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { getAuth } from "firebase/auth";
import { Handlelogin } from "../config/firebase";
import "../login.css";
import GoogleIcon from "@mui/icons-material/Google";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = ({ component: Component, ...rest }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();
  const auth = getAuth();
  const userr = auth.currentUser;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      if (!(value.includes("@") && value.includes(".com"))) {
        setEmail(value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `Email must contain "@" symbol and ".com"`,
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

  const login = async (e) => {
    if (!(formErrors.email || formErrors.password)) {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/tasks");
      } catch (error) {
        alert("Invalid login credentials!");
        console.error();
      }
    } else {
      alert("Invalid login credentials!");
    }
  };

  const navigatetohome = () => {
    // navigate("/");
  };

  const navigatetosignup = () => {
    // navigate("/signup");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logodivv h1" onClick={navigatetohome}>
          <EventNoteIcon />
        </div>
      </nav>
      <div className="login-box">
        <p>Login</p>
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
          <button className="btttn" onClick={login}>
            Submit
          </button>
          <div className="bttn">
            <button onClick={signInWithGoogle}>
              <GoogleIcon /> Sign in with Google
            </button>
          </div>
        </form>
        <p>
          Don't have an account?
          <Link href="/" className="signup" onClick={navigatetosignup}>
            {" "}
            Sign up!
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
