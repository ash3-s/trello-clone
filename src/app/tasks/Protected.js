import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const Protected = ({ children }) => {
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return unsubscribe;
  }, []);

  if (isLoggedIn) {
    return children;
  } else {
    router.push("/");
  }
};
export default Protected;
