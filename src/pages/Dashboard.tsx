import { Card } from "primereact/card";
import DashboardChart from "../components/Chart";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import AppWidgetSummary from "../components/Summery";
import glassMessage from "../Assets/glass/ic_glass_message.png";
import glassBag from "../Assets/glass/ic_glass_bag.png";
import glassbuy from "../Assets/glass/ic_glass_buy.png";
import glassUsers from "../Assets/glass/ic_glass_users.png";
import AppWebsiteVisits from "../components/Chart";
import SideBar from "../components/SideBar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AppUsersVisits from "../components/Circle";

const Dashboard = () => {
  return (
    <div className="flex" style={{ backgroundColor: "whitesmoke" }}>
      <SideBar />
      <div>
        <div>
          <span>
            <h1 className="text-center text-4xl get-rp ml-5">
              Welcome In Ge<span className="secondery">t</span>rip
            </h1>
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
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap mr-0 gap-5 mt-5">
            <div className="grid grid-cols-2 w-full">
              <AppWebsiteVisits
                title="Website Visits"
                subheader="(+43%) than last year"
              />
              <AppUsersVisits
                title="Website Visits"
                subheader="(+43%) than last year"
              />
            </div>
          </div>
        </div>
        <div className="ml-5">
          <Card title="Orders" className="mb-5">
            <DataTable
              // value={UsersList}
              stripedRows
              showGridlines
              className=" p-5"
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="username" sortField="" header="Order"></Column>
              <Column field="name" header="Name"></Column>
              <Column field="lastname" header="Date"></Column>
              <Column field="business" header="Status"></Column>
            </DataTable>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
