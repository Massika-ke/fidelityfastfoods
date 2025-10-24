// import { useContext, useState } from 'react'
// import './LoginPopup.css'
// import { assets } from '../../assets/assets'
// import { StoreContext } from '../../context/StoreContext'
// import axios from 'axios'

// const LoginPopup = ({setShowLogin}) => {

//   const {url, setToken} = useContext(StoreContext);

//     const [currState, setCurrState] = useState('Sign Up')
//     const [data, setData] = useState({
//       name: "",
//       email: "",
//       password: ""
//     })

//     const onChangeHandler = (e)=>{
//       const name = e.target.name;
//       const value = e.target.value;
//       setData(data=>({...data, [name]:value}))
//     }

//     // api calls to the backend
//     const onLogin = async (e) =>{
//       e.preventDefault()
//       let newUrl = url;
//       if (currState === "Login") {
//         newUrl += "/api/user/login"
//       }
//       else{
//         newUrl += "/api/user/register"
//       }

//       const response = await axios.post(newUrl, data);

//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);
//         setShowLogin(false)
//       }
//       else{
//         alert(response.data.message)
//       }
//     }

//   return (
//     <div>
//       <div className="login-popup">
//         <form onSubmit={onLogin} className="login-popup-container">
//             <div className="login-popup-title">
//                 <h2>{currState}</h2>
//                 <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
//             </div>
//             <div className="login-popup-inputs">
//                 {currState==="Login"?
//                 <></>: 
//                 <input name= 'name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
//                 <input name= 'email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
//                 <input name= 'password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
//             </div>
//             <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
//             <div className="login-popup-condition">
//                 <input type="checkbox" required />
//                 <p>By continuing, you agree to the terms of use & privacy policy</p>
//             </div>
//             {currState==="Login"
//             ?<p>Create a new account?  <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
//             :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login</span></p>
//             }
//         </form>
//       </div>
//     </div>
//   )
// }

// export default LoginPopup;



import { useContext, useState, useEffect } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({setShowLogin}) => {

  const {url, setToken} = useContext(StoreContext);

  const [currState, setCurrState] = useState('Sign Up')
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({...data, [name]: value}))
    // Clear error when user starts typing
    if (error) setError("")
  }

  // Handle closing with animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowLogin(false)
      setIsClosing(false)
    }, 300) // Match animation duration
  }

  // Close popup when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('login-popup')) {
      handleClose()
    }
  }

  // Close popup with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [setShowLogin])

  // API calls to the backend
  const onLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        handleClose()
      } else {
        setError(response.data.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Unable to connect. Please check your connection and try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Switch between Login and Sign Up
  const toggleState = () => {
    setCurrState(currState === "Login" ? "Sign Up" : "Login")
    setError("")
    // Clear name field when switching to login
    if (currState === "Sign Up") {
      setData(prev => ({...prev, name: ""}))
    }
  }

  return (
    <div className={`login-popup ${isClosing ? 'closing' : ''}`} onClick={handleBackdropClick}>
      <form 
        onSubmit={onLogin} 
        className={`login-popup-container ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img 
            onClick={handleClose} 
            src={assets.cross_icon} 
            alt="Close" 
            title="Close"
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input 
              name='name' 
              onChange={onChangeHandler} 
              value={data.name} 
              type="text" 
              placeholder='Full Name' 
              required 
              disabled={isLoading}
              autoComplete="name"
            />
          )}
          <input 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type="email" 
            placeholder='Email Address' 
            required 
            disabled={isLoading}
            autoComplete="email"
          />
          <input 
            name='password' 
            onChange={onChangeHandler} 
            value={data.password} 
            type="password" 
            placeholder='Password' 
            required 
            disabled={isLoading}
            autoComplete={currState === "Login" ? "current-password" : "new-password"}
            minLength="6"
          />
        </div>

        <button 
          type='submit' 
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? '' : (currState === "Sign Up" ? "Create Account" : "Login")}
        </button>

        <div className="login-popup-condition">
          <input 
            type="checkbox" 
            required 
            disabled={isLoading}
            id="terms-checkbox"
          />
          <label htmlFor="terms-checkbox">
            By continuing, you agree to our terms of use & privacy policy
          </label>
        </div>

        <p>
          {currState === "Login" ? 
            <>Don&apos;t have an account? <span onClick={toggleState}>Sign Up</span></> :
            <>Already have an account? <span onClick={toggleState}>Login</span></>
          }
        </p>
      </form>
    </div>
  )
}

export default LoginPopup;