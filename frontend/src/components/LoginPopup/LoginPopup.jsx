import { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup = ({setShowLogin}) => {

  const {url} = useContext(StoreContext);

    const [currState, setCurrState] = useState('Sign Up')
    const [data, setData] = useState({
      name: "",
      email: "",
      password: ""
    })

    const onChangeHandler = (e)=>{
      const name = e.target.name;
      const value = e.target.value;
      setData(data=>({...data, [name]:value}))
    }

    const onLogin = async ()=>{

    }

  return (
    <div>
      <div className="login-popup">
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currState==="Login"?
                <></>: 
                <input name= 'name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
                <input name= 'email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                <input name= 'password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
            </div>
            <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>By continuing, you agree to the terms of use & privacy policy</p>
            </div>
            {currState==="Login"
            ?<p>Create a new account?  <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
            :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login</span></p>
            }
        </form>
      </div>
    </div>
  )
}

export default LoginPopup;
