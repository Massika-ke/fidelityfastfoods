import { useState } from 'react'
import './Orders.css'
import toast from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'
import {assets} from "../../assets/assets"


const Orders = ({url}) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () =>{
    const response = await axios.get(url+"/api/order/list");

    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    }
    else{
      toast.error("Error")
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])


  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order list">
        {orders.map((order, index)=>(
          <div key={index} className="order item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index)=>{
                  if (index===order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
               
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders