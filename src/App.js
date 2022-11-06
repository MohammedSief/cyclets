//import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';

import Home from './modules/Home/Home';
import About from './modules/About/About';
import Services from './modules/Services/Services';
import Network from './modules/Network/Network';
import Login from './modules/Login/Login';
import Register from './modules/Register/Register';
import NavBar from './modules/Navbar/Navbar';
import Notfound from './modules/Notfound/Notfound';
import Welcome from './modules/Welcome/Welcome';
import ProductDetails from './modules/ProductDetails/ProductDetails';

import { CounterContextProvider } from './CounterContext';






export default function App() {

  const [userData, setUserData] = useState(null);
  // "useState" takes sometime (asynchronous) , 
  //  and it doesn't have place to write "console.log" to check the output, 
  //  so "useEffect" will solve this problem -> now, we can check if "setUserData" works or not
  useEffect(() => {
    console.log(`userData: ${userData}`);
  }, [userData]);


  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      getUserData();
    }
  }, []);




  // this function will solve the problem of logout when the user refreshes the web page
  function getUserData() {
    // 1- get the userToken from localStorage & un-decode the userToken  
    let decodedUserToken = jwtDecode(localStorage.getItem("userToken"));
    // 2- update the "userData" by using "setUserData" function
    setUserData(decodedUserToken);
    //console.log(userData); // not useful because "useState" takes sometime (asynchronous) ... it will be always "null"
  }




  let navigate = useNavigate();


  function logOut() {

    // 1- delete the "userToken" in the localStorage
    localStorage.removeItem("userToken");
    // 2- let the "userData = null"
    setUserData(null);
    // 3- navigate the user to "logIn page" or "Welcome page"
    navigate("/");

  }



  // to force the user to "login" before enter the website 
  // if he wrote anything in the url path like "/home"

  // [NOTE] we write -> function ProtectedRoute({ children }) NOT function ProtectedRoute(props)
  function ProtectedRoute({ children }) {

    let location = useLocation(); // the url before we log in
    console.log(location.pathname);

    // it will force the user to go to login first 
    // then, it navigates him to what he wanted (the "children" of the "<ProtectedRoute>") 
    if (!localStorage.getItem("userToken")) {
      return <Navigate to={"/login"} state={{ from: location.pathname }} replace />
      // the difference between "navigate('/login');" & <Navigate to={"/login"} />
      // "navigate('/login');" -> if we want an automatic navigation when we press
      // <Navigate to={"/login"} /> -> if we want an automatic navigation when we write in the url path
    } else {
      return children
      // props.children === children ... that's why we destruct children above in the function 
    }

  }




  return (

    <div className="container">

      <NavBar userData={userData} logOut={logOut} />

      <Routes>

        <Route path="/" element={<Welcome />} />
        <Route path="home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="about" element={<ProtectedRoute> <About /> </ProtectedRoute>} />
        <Route path="services" element={<ProtectedRoute> <Services /> </ProtectedRoute>} />

        <Route path="productDetails" element={<ProtectedRoute> <ProductDetails /> </ProtectedRoute>}>
          <Route path=":id" element={<ProtectedRoute> <ProductDetails /> </ProtectedRoute>} />
        </Route>

        <Route path="network" element={<ProtectedRoute> <Network /> </ProtectedRoute>} />

        <Route path="login" element={<Login getUserData={getUserData} myURL={useLocation} />} />
        <Route path="register" element={<Register />} />

        <Route path="*" element={<Notfound />} />

      </Routes>


    </div>

  )

}


/*

return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );

*/

