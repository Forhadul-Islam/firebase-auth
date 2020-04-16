import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();

  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    isValid: false,
    existingUser: false,
    error: "",
    photo: ""

  });

  //signIn eventHandler
  const handleSingIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        //console.log(result);
      })
      .catch(error => {
        console.log(error)
      })

  };

  //signOut eventHandler
  const handleSingOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          password: '',
          photo: '',
          isValid: false
        }
        setUser(signedOutUser)

      })
      .catch(error => {

      })
  };


  //form related
  const is_valid_email = email => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  const hasNumber = password => /\d/.test(password);

  const switchForm = event => {
    const createUser = { ...user }
    createUser.existingUser = event.target.checked;
    setUser(createUser);
  }
  const handleChange = event => {
    //console.log(event.target.name, event.target.value)
    //email and password validation
    let isValid = true;
    if (event.target.name === "email") {
      isValid = is_valid_email(event.target.value);
    }
    if (event.target.name === "password") {
      isValid = event.target.value.length > 6 && hasNumber(event.target.value);
    }

    const newUser = {
      ...user,
      [event.target.name]: event.target.value
    }
    newUser.isValid = isValid
    setUser(newUser);
  }

  const signInUser = event => {
    if (user.isValid) {
      //console.log(user.email, user.password)
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const createUser = { ...user }
          createUser.isSignedIn = true;
          createUser.error = "";
          setUser(createUser);
        })
        .catch(err => {
          const error = err.message;
          const createUser = { ...user }
          createUser.isSignedIn = false;
          createUser.error = error;
          setUser(createUser);

        })
    }
    event.preventDefault();
    event.target.reset();
  }
  const createAccount = (event) => {
    if (user.isValid) {
      //console.log(user.email, user.password)
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const createUser = { ...user }
          createUser.isSignedIn = true;
          createUser.error = "";
          setUser(createUser);
        })
        .catch(err => {
          const error = err.message;
          const createUser = { ...user }
          createUser.isSignedIn = false;
          createUser.error = error;
          setUser(createUser);

        })
    } else { console.log('user is not valid ') }
    event.preventDefault()
    event.target.reset();
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSingOut}>Sign out </button> :
          <button onClick={handleSingIn}>Sign in </button>
      }
      {user.isSignedIn && <div> <p>Welcome, {user.name}</p>
      Your email: {user.email}
      </div>
      }
      <div>
        <h3>Our Own Authentication</h3>
        <input onChange={switchForm} type="checkBox" name="name" id="switchForm" />
        <label htmlFor="switchForm">Sign in</label>
        <br />

        <form style={{ display: user.existingUser ? "block" : "none" }} onSubmit={signInUser} >
          <input onBlur={handleChange} type="text" name="email" placeholder="Your email" autoComplete="off" required />
          <br />
          <input onBlur={handleChange} type="password" name="password" placeholder="Enter your password" autoComplete="off" required />
          <br />
          <input type="submit" value="signIn" />
        </form>
        <form style={{ display: user.existingUser ? "none" : "block" }} onSubmit={createAccount} >
          <input onBlur={handleChange} type="text" name="name" placeholder="Your name" autoComplete="off" required />
          <br />
          <input onBlur={handleChange} type="text" name="email" placeholder="Your email" autoComplete="off" required />
          <br />
          <input onBlur={handleChange} type="password" name="password" placeholder="Enter your password" autoComplete="off" required />
          <br />
          <input type="submit" value="Create Account" />
        </form>
      </div>


      {
        user.error && <p style={{ color: "red", fontSize: "20px" }}>sorry, {user.error}</p>
      }
    </div>
  );
}

export default App;
