import { useEffect } from "react";

const OrderHistory = () => {
 const User = JSON.parse(localStorage?.getItem('user') as any)
 const name = User?.data?.name + ' ' + User?.data?.lastname
 const email = User?.data?.email

useEffect(() => {
  //
}, []);

  return(
    <div className="container">
      Order History
    </div>
  )
}

export default OrderHistory;
