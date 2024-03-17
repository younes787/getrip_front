import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";


const Login = () =>{
  const navigate = useNavigate()
return(
  <div className="login-back">
  <div className="login-form">
  <h1 className="md:mb-6 lg:mb-6 text-center text-bluegray-900">Welcome to Our Travel Website!</h1>
        <label className=" font-bold text-base text-bluegray-900 p-2" >UserName </label>
        <InputText placeholder="UserName"></InputText>
        <label className="mt-3 font-bold text-base text-bluegray-900 p-2">Password</label>
        <InputText type="password" placeholder="Password"/>
        <Button label="Log In" onClick={() => navigate('/')} className="mt-5 mb-5" />
        <div className="mb-8 text-center border-round p-2" style={{backgroundColor:'white'}}>
        <p className=" font-bold text-base text-bluegray-900 mt-1" style={{height:'10px'}}> OR You Don't Have an account ?</p>
        <a href="/register" className=" font-bold text-lg mb-3 primary cursor-pointer"> Register Here</a>
        </div>
    </div>
    </div>

)
}

export default Login;