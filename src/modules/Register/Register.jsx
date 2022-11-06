import axios from 'axios';
import Joi from 'joi';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Register() {

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    age: 0,
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState("")

  const [errorList, setErrorList] = useState([])

  let navigate = useNavigate();



  function getUser(e) {

    // e -> event ... it carries all the data of the event which happened

    //deep copy from "user" object
    let myUser = { ...user }; 

    myUser[e.target.name] = e.target.value;
    // myUser.first_name ===> myUser[e.target.name] ... it is more dynamic

    setUser(myUser);

    //console.log("Hello");
    //console.log(e);
    //console.log(user); //setUser() changed the value of "user" with "myUser"

  }





  // onSubmit={} is better than onClick={} ... you can submit by enter button with it (it is more general)

  async function submitUser(e) {
    e.preventDefault(); // to prevent the form event from clearing the content after submit
    //setIsLoading(true); 

    let validationResult = validationRegistration(user);
    console.log(validationResult);

    if (validationResult.error) {
      //setIsLoading(false); // to stop the loading spinner
      setErrorList(validationResult.error.details)
      // show the error
      console.log(validationResult.error.details);

    } else {
      setIsLoading(true); // to make the spinner work after submit without errors

      // reset the error list, if there were errors and the user corrected them
      setErrorList([]);

      let { data } = await axios.post(`https://routeegypt.herokuapp.com/signup`, user)
      // better we destructed the "data" from the "response" -> response.data -> {data}
      //let response = await axios.post(`https://routeegypt.herokuapp.com/signup`, user)

      // axios will send the data of "user" to the URL , 
      // then axios will response to my request
      // if I didn't write "await" before axios -> the response will return "promise{<pending>}"

      console.log(data);

      if (data.message === "success") {
        //setIsLoading(false); // data success , so now the loading is finished so we turn it to be false again
        //navigate the user to login page
        navigate("/login" , {replace:true});
      } else {
        //show the error which came from the API
        setError(data.message);
      }
    }
  }





  function validationRegistration(user) {
    let schema = Joi.object({
      first_name: Joi.string().alphanum().min(3).max(15).required(),
      last_name: Joi.string().alphanum().min(3).max(15).required(),
      age: Joi.number().min(16).max(70).required(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user, { abortEarly: false }); // "abortEarly:false" is used to show all errors not the first error only

  }





  return (

    <div>

      <h3 className='my-3'>Register to ride</h3>

      {errorList.map((error, index) => {
        if (index === 4) {
          return <div key={index} className="alert alert-danger">"Password" is not allowed to be empty</div> /* special alert for password*/
        } else {
          return <div key={index} className="alert alert-danger">{error.message}</div> /*Validation alert */
        } 
      }
      )}

      {error ? <div className="alert alert-danger">{error}</div> : "" /* API alert*/}



      <form onSubmit={submitUser} className='w-25 mt-3'>

        <label htmlFor="first_name">First Name :</label>
        <input onChange={getUser} type="text" name="first_name" id="first_name" className='form-control mt-2 mb-3' />

        <label htmlFor="last_name">Last Name :</label>
        <input onChange={getUser} type="text" name="last_name" id="last_name" className='form-control mt-2 mb-3' />

        <label htmlFor="age">Age :</label>
        <input onChange={getUser} type="number" name="age" id="age" className='form-control mt-2 mb-3' />

        <label htmlFor="email">Email :</label>
        <input onChange={getUser} type="email" name="email" id="email" className='form-control mt-2 mb-3' />

        <label htmlFor="password">Password :</label>
        <input onChange={getUser} type="password" name="password" id="password" className='form-control mt-2 mb-3' />

        <button type='submit' className='btn btn-outline-orange mt-3 mb-5 px-4'>
          {isLoading === true ? <i className='fas fa-spinner fa-spin'></i> : "Register"}
        </button>

      </form>

    </div>
  )
}