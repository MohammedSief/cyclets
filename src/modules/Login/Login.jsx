import axios from 'axios';
import Joi from 'joi';
import React, { useState } from 'react'
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { CounterContext } from '../../CounterContext';

export default function Login(props) {


  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState("")

  const [errorList, setErrorList] = useState([])

  let navigate = useNavigate();



  function getUser(e) {

    // e -> event ... it carries all the data of the event which happened

    let myUser = { ...user };

    myUser[e.target.name] = e.target.value;
    // myUser.first_name ===> myUser[e.target.name] ... it is more dynamic

    setUser(myUser);

    //console.log("Hello");
    //console.log(e);
    //console.log(user); //setUser() changed the value of "user" with "myUser"

  }



// we need to use the Context
  let x = useContext(CounterContext);
//console.log(x.count);


  // onSubmit={} is better than onClick={} ... you can submit by enter button with it (it is more general)

  async function logInUser(e) {
    e.preventDefault(); // to prevent the form event from clearing the content after login
    setIsLoading(true); // to make the spinner work when we press login

    let validationResult = validationRegistration(user);
    console.log(validationResult);
    //console.log({ errorName: error });



    if (validationResult.error) {
      // stop spinner for a new entry
      setIsLoading(false);
      // show the error
      setErrorList(validationResult.error.details)
      console.log(validationResult.error.details);

    } else {
      // show the user the loading spinner means something preparing
      setIsLoading(true);

      // reset the error list, if there were errors and the user corrected them
      setErrorList([]);

      let { data } = await axios.post(`https://routeegypt.herokuapp.com/signin`, user)
      // better we destructed the "data" from the "response" -> response.data -> {data}
      //let response = await axios.post(`https://routeegypt.herokuapp.com/signin`, user)

      // axios will send the data of "user" to the URL , 
      // then axios will response to my request
      // if I didn't write "await" before axios -> the response will return "promise{<pending>}"

      console.log(data);

      if (data.message === "success") {

        //setIsLoading(true); // data success , so now the loading is finished so we turn it to be false again

        localStorage.setItem("userToken", data.token) //get the "token" from "data.token" (the backend response) and save it in the localStorage with a key name "userToken"

        props.getUserData();

        console.log(props);

        //let url = URL();
        //let myURL = props.location.pathname ;

        //navigate the user to "home page"
        navigate("/home", { replace: true });
        //{replace:true} -> to prevent go back to "login" page when the user press the back button 




      } else {
        //stop the spinner for a new entry
        //show the error which came from the API
        setIsLoading(false);
        setError(data.message);
      }
    }
  }





  function validationRegistration(user) {
    let schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user, { abortEarly: false }); // "abortEarly:false" is used to show all errors not the first error only

  }





  return (

    <div>

      <h3 className='my-3'>Login to ride</h3>

      {errorList.map((error, index) => {
        if (index === 1) {
          return <div key={index} className="alert alert-danger">"Password" is not allowed to be empty</div> /* special alert for password*/
        } else {
          return <div key={index} className="alert alert-danger">{error.message}</div> /*Validation alert */
        }
      }

      )}

      {error ? <div className="alert alert-danger">{error}</div> : "" /* API alert*/}



      <form onSubmit={logInUser} className='w-25 mt-3'>

        <label htmlFor="email">Email :</label>
        <input onChange={getUser} type="email" name="email" id="email" className='form-control mt-2 mb-3' />

        <label htmlFor="password">Password :</label>
        <input onChange={getUser} type="password" name="password" id="password" className='form-control mt-2 mb-3' />

        <button type='submit' className='btn btn-outline-orange mt-3 mb-5 px-4'>
          {isLoading === true ? <i className='fas fa-spinner fa-spin'></i> : "Login"}
        </button>

      </form>

    </div>
  )
}