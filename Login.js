import React, {useContext, useState} from 'react'
import loginpic from '../images/logo.png';
import { NavLink, useHistory } from 'react-router-dom';

import { UserContext } from '../App';

const Login = () => {

  const {state, dispatch} = useContext(UserContext);

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch('/signin', {
        method:"POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
    });

    const data = res.json();

    if(res.status === 400 || !data) {
      window.alert('Invalid Credentials');
    } else {
      dispatch({type:"USER", payload:true})
      window.alert('Login Sucessfull');
      history.push('/');
    }
  }

  return (
    <>
      <section className='signin'>
        <div className='container mt-5'>
          <div className='signup-content'>
              
              <div className='signuinimage'>
                  <figure>
                    <img src={loginpic} alt='registration pic' />
                  </figure>
                  <NavLink to='/signup' className='signup-image-link'>Create An Acount</NavLink>
              </div>

            <div className='signin-form'>
              <h2 className='form-title'>Sign up</h2>
              <form method="POST" className='register-form' id='register-form'>
                
                
                <div className='form-group'>
                  <label htmlFor='email'>
                    <i class="zmdi zmdi-email material-icons-name"></i>
                  </label>
                  <input type='email' name='email' id='email' autoComplete='off'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}                   
                    placeholder='Your email'
                    />
                </div>

                <div className='form-group'>
                  <label htmlFor='password'>
                    <i class="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input type='password' password='Phone' id='password' autoComplete='off'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Your Password'
                    />
                </div>


                <div className='form-group form-button'>
                  <input type="submit" name='signin' className='form-submit'
                      value='Login'
                      onClick={loginUser}
                  />
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login;
