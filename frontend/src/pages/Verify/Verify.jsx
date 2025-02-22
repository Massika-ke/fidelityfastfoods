/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Verify.css"
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";


const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();


    const verifyPayment = async ()=>{

        try {
            setIsLoading(true);
            const response = await axios.post(
            `${url} /api/order/verify`, {success, orderId}
        );

        if (response.data.success) {
            navigate("/myorders")
        }
        else{
            navigate("/")
        }
        } catch (error) {
            console.error("Verification error:", error);
            setError("Payment verification failed");
            // Redirect to home after error
            setTimeout(() => navigate("/"), 2000);
        }
        finally {
            setIsLoading(false)
        }
        
    }

    useEffect(()=>{
        verifyPayment();
    }, []);
    
  return (
    <div className="verify">
       <div className="spinner">

       </div>
    </div>
    // <div className="verify min-h-screen flex items-center justify-center">
    //         {isLoading ? (
    //             <div className="spinner-container text-center">
    //                 <div className="spinner mb-4"></div>
    //                 <p>Verifying your payment...</p>
    //             </div>
    //         ) : error ? (
    //             <div className="error-message text-red-500">
    //                 {error}
    //             </div>
    //         ) : null}
    //     </div>
    
  )
}

export default Verify;