import { redirect } from "next/navigation";
import { useEffect } from "react";
import { auth, checkUser } from "../config/firebase";

const Auth = (WrappedComponent) => {
  return (props) => {
    const isAuth = checkUser(auth);

    useEffect(() => {
      if (!isAuth) {
        redirect("/login"); // Redirect to login page if not authenticated
      }
    }, [isAuth]);

    if (!isAuth) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default Auth;
