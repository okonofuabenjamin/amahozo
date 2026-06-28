import React, { useContext, useState } from "react"; // Importing React and necessary hooks
import classes from "./Auth.module.css"; // Importing CSS module for authentication page styles
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importing routing components
import { auth } from "../../Utility/firebase"; // Importing Firebase authentication instance
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"; // Importing Firebase authentication methods
import { DataContext } from "../../components/DataProvider/DataProvider"; // Importing context for global state management
import { Type } from "../../Utility/action.type"; // Importing action types for the reducer
import { ClipLoader } from "react-spinners"; // Importing a loading spinner component

function Auth() {
  // State to track email, password, errors, and loading for sign in/up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    signIn: false,
    signUp: false,
  });

  // Accessing global state (user) and dispatch from context
  const [{ user }, dispatch] = useContext(DataContext);

  const navigate = useNavigate(); // Hook for programmatic navigation
  const navStateData = useLocation(); // Hook for accessing state passed with navigation (e.g., messages or redirects)
  console.log(navStateData); // Logging the navigation state for debugging

  // Handler for authentication (sign in or sign up based on button clicked)
  const authHandler = (e) => {
    e.preventDefault(); // Prevent form submission

    if (e.target.name === "signIn") {
      // Handle Sign In
      setLoading({ ...loading, signIn: true }); // Set loading state for sign in
      signInWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          // Successful sign-in
          dispatch({
            type: Type.SET_USER, // Dispatch action to set user in global state
            user: userInfo.user,
          });
          setLoading({ ...loading, signIn: false }); // Reset loading state
          navigate(navStateData?.state?.redirect || "/"); // Navigate to intended page or home
        })
        .catch((err) => {
          setError(err.message); // Set error message if sign-in fails
          setLoading({ ...loading, signIn: false }); // Reset loading state
        });
    } else {
      // Handle Sign Up
      setLoading({ ...loading, signUp: true }); // Set loading state for sign up
      createUserWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          // Successful sign-up
          dispatch({
            type: Type.SET_USER, // Dispatch action to set user in global state
            user: userInfo.user,
          });
          setLoading({ ...loading, signUp: false }); // Reset loading state
          navigate(navStateData?.state?.redirect || "/"); // Navigate to intended page or home
        })
        .catch((err) => {
          setError(err.message); // Set error message if sign-up fails
          setLoading({ ...loading, signUp: false }); // Reset loading state
        });
    }
  };

  return (
    <section className={classes.auth}>
      {/* Amazon logo */}
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Amazon_2024.svg/1280px-Amazon_2024.svg.png"
          alt="amazon logo"
        />
      </Link>

      {/* Authentication form */}
      <div className={classes.auth__container}>
        <h1>Sign In</h1>
        {/* Optional login message if passed via navigation state */}
        {navStateData?.state?.msg && (
          <small className={classes.auth__msg_login}>
            {navStateData?.state?.msg}
          </small>
        )}

        {/* Form with email and password fields */}
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Set email state
              type="email"
              id="email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Set password state
              type="password"
              id="password"
            />
          </div>
          {/* Sign In button */}
          <button
            type="submit"
            onClick={authHandler}
            name="signIn"
            className={classes.auth__signIn_btn}
          >
            {loading.signIn ? <ClipLoader color="#000" size={15} /> : "Sign In"}{" "}
            {/* Display loading spinner or text */}
          </button>
        </form>

        {/* Agreement message */}
        <p>
          By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use &
          Sale. Please see our Privacy Notice, Cookies Notice, and our
          Interest-based Ads Notice.
        </p>

        {/* Create Account button */}
        <button
          type="submit"
          onClick={authHandler}
          name="signUp"
          className={classes.auth__signUp_btn}
        >
          {loading.signUp ? (
            <ClipLoader color="#000" size={15} />
          ) : (
            "Create your Amazon Account"
          )}{" "}
          {/* Display loading spinner or text */}
        </button>

        {/* Error message */}
        {error && <small className={classes.auth__error}>{error}</small>}
      </div>
    </section>
  );
}

export default Auth; // Exporting the component for use in other parts of the application
