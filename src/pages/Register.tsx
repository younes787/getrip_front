import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";


const Register = () =>{
return(
  <div className="login-back">
  <div className="login-form">
  <h1 className="md:mb-6 lg:mb-6 text-center text-bluegray-900">Welcome to Our Travel Website!</h1>
  <div className="grid justify-content-center gap-4">
      <div className="md:col-4 lg::col-4">
        <label className=" font-bold text-base text-bluegray-900 " >First Name </label>
        <InputText placeholder="First Name"></InputText>
       </div>
      <div className="md:col-4 lg::col-4">
        <label className=" font-bold text-base text-bluegray-900 " >Last Name </label>
        <InputText placeholder="Last Name"></InputText>
       </div>
   </div>

   <div className="grid justify-content-center gap-1 mt-3">
      <div className="md:col-5 lg::col-5 ">
        <label className=" font-bold text-base text-bluegray-900 " >Password </label>
        <InputText placeholder="Password"></InputText>
       </div>
      <div className="md:col-4 lg::col-4">
        <label className=" font-bold text-base text-bluegray-900 " >Adress </label>
        <InputText placeholder="Adress"></InputText>
       </div>
   </div>
       
        <Button label="Sign Up" className="mt-5 mb-5" />
        <div className="mb-8 text-center border-round p-2" style={{backgroundColor:'white'}}>
        <p className=" font-bold text-base text-bluegray-900 mt-1" style={{height:'10px'}}> OR You Have an account ?</p>
        <a  href = '/login' className=" font-bold text-lg mb-3 primary cursor-pointer"> Login Here</a>
        </div>
    </div>
    </div>

)
}

export default Register;