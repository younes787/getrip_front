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
import { Accordion, AccordionTab } from "primereact/accordion";

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: "whitesmoke" }}>
      <div>
        <div>
          <span>
            <h1 className="text-center text-4xl get-rp ml-5">
              Welcome In Ge<span className="secondery">t</span>rip
            </h1>
          </span>
          <div className="mt-5 ml-5 pr-4">
          <Accordion activeIndex={0}>
          <AccordionTab header='Summery'>
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
            </AccordionTab>
            </Accordion>
          </div>
        </div>
        <div className="ml-5 mt-5 pr-4">
        <Accordion activeIndex={0}>
        <AccordionTab header='Requests'>
            <div>
            <DataTable
              // value={UsersList}
              stripedRows
              showGridlines
              className=" p-5"
              tableStyle={{ minWidth: "50rem" }}
              sortMode="multiple"
              rows={5}
              rowsPerPageOptions={[10, 15, 20, 50]}
              paginator
              rowHover
            >
              <Column field="username" sortable sortField="" header="Customer"></Column>
              <Column field="name" sortable header="Subject"></Column>
              <Column field="lastname" sortable header="Date"></Column>
              <Column field="business"sortable header="Status"></Column>
              <Column field="" sortable header="Actions"></Column>
            </DataTable>
            </div>
            </AccordionTab>
          </Accordion>
          <Accordion activeIndex={0}>
          <AccordionTab header='Orders' >
            <div>
            <DataTable
              // value={UsersList}
              stripedRows
              showGridlines
              className=" p-5"
              tableStyle={{ minWidth: "50rem" }}
              sortMode="multiple"
              rows={5}
              rowsPerPageOptions={[10, 15, 20, 50]}
              paginator
              rowHover
            >
              <Column field="username" sortable sortField="" header="Customer"></Column>
              <Column field="name" sortable header="Service"></Column>
              <Column field="lastname" sortable header="Saler"></Column>
              <Column field="business" sortable header="Status"></Column>
            </DataTable>
            </div>
            </AccordionTab>
          </Accordion>
        </div>
        <div className="ml-5 mt-5 pr-4 pb-2">
        <Accordion activeIndex={0}>
          <AccordionTab header='Charts'>
          <div className="flex flex-wrap  mr-0 gap-5 mt-5" >
            <div className="grid grid-cols-2 w-full" style={{justifyContent:'center'}}>
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
          </AccordionTab>
          </Accordion>
        </div>
       
      </div>
    </div>
  );
};

export default Dashboard;
