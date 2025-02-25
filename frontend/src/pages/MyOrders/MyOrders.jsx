import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';

const MyOrders = () => {

    const {url, token} = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async ()=>{
        const response = await axios.post(
            url+ "/api/order/userorders", {}, {headers:{token}}
        );
        setData(response.data.data);
        
    }

    useEffect(()=>{
        if (token) {
            fetchOrders();
        }
    }, [token])

  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order, index)=>{
                return (
                    <div key={index} className="my-orders-order">
                     <img src="" alt="" />   
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders