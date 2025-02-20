import { useSearchParams } from "react-router-dom";
import "./Verify.css"
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";


const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const {url} = useContext(StoreContext);


    const verifyPayment = async ()=>{
        const response = await axios.post(url+ "/api/order/verify", success, orderId)
    }
    
  return (
    <div className="verify">
       <div className="spinner">

       </div>
    </div>
    
  )
}

export default Verify;