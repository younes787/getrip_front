import { Card } from "primereact/card";
import DashboardChart from "../components/Chart";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";


const Dashboard = () =>{
const navigate = useNavigate()
return(
    <>
    <span>
        <h1 className="text-center text-4xl get-rp">Welcome In  Ge<span className="secondery">t</span>rip</h1>  
          </span>
    <DashboardChart/>
    <Card>
    <div className="grid gap-7 ml-3">
    <Button
        rounded
        label="Manage Users"
        icon="pi pi-user"
        onClick={()=>navigate('/users')}
        className="pr_btn"
      />
      <Button
        rounded
        label="Manage Services"
        icon="pi pi-user"
        // onClick={() => setshow(true)}
        className="pr_btn"
      />
      <Button
        rounded
        label="Manage Payment"
        icon="pi pi-user"
        // onClick={() => setshow(true)}
        className="pr_btn"
      />
    </div>
    
    </Card>
    </>
)

}

export default Dashboard;