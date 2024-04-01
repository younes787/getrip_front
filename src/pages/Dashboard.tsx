import { Card } from "primereact/card";
import DashboardChart from "../components/Chart";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import AppWidgetSummary from "../components/Summery";
import glassMessage from '../Assets/glass/ic_glass_message.png'
import glassBag from '../Assets/glass/ic_glass_bag.png'
import glassbuy from '../Assets/glass/ic_glass_buy.png'
import glassUsers from '../Assets/glass/ic_glass_users.png'
import AppWebsiteVisits from "../components/Chart";


const Dashboard = () =>{
const navigate = useNavigate()
return(
    <>
    <span>
        <h1 className="text-center text-4xl get-rp">Welcome In  Ge<span className="secondery">t</span>rip</h1>  
          </span>
          <div className="grid mr-0 gap-5 mt-5">
          <AppWidgetSummary
            title="Weekly Sales"
            total={714}
            color="success"
            icon={<img alt="icon" src={glassBag} />}
          />
           <AppWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src={glassUsers} />}
          />
             <AppWidgetSummary
            title="Weekly Orders"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src={glassbuy} />}
          />
          <AppWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src={glassMessage}/>}
          />
          </div>
          <div className="mt-5">
          <AppWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"/>
          </div>
    <Card>
    <div className="grid gap-7 mt-5 ml-3">
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