import AppWidgetSummary from "../components/Summery";
import glassBag from "../Assets/glass/ic_glass_bag.png";
import glassbuy from "../Assets/glass/ic_glass_buy.png";
import glassUsers from "../Assets/glass/ic_glass_users.png";
import AppWebsiteVisits from "../components/Chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AppUsersVisits from "../components/Circle";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Image } from 'primereact/image';
import { Trans, useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <span>
        <h1 className="text-center text-4xl get-rp ml-5">
          <Trans i18nKey="Dashboard.welcomeMessage" components={{ strongClass: <span className="secondery" /> }}>
            Welcome In Ge<span className="secondery">t</span>rip
          </Trans>
        </h1>
      </span>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Summery')}>
        <div className="grid mr-0 gap-5 mt-5">
            <AppWidgetSummary
              title={t('Dashboard.Weekly Sales')}
              total={714}
              color="success"
              icon={<Image src={glassBag} alt={`icon`}  />}
            />

            <AppWidgetSummary
              title={t('Dashboard.New Users')}
              total={1352831}
              color="info"
              icon={<Image src={glassUsers} alt={`icon`}  />}
            />

            <AppWidgetSummary
              title={t('Dashboard.Weekly Orders')}
              total={1723315}
              color="warning"
              icon={<Image src={glassbuy} alt={`icon`}  />}
            />
          </div>
          </AccordionTab>
      </Accordion>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Requests')}>
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
        </AccordionTab>
      </Accordion>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Orders')} >
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
        </AccordionTab>
      </Accordion>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Charts')} >
          <div className="flex flex-wrap  mr-0 gap-5 mt-5" >
            <div className="grid grid-cols-2 w-full" style={{justifyContent:'center'}}>
              <AppWebsiteVisits
                title={t('Dashboard.Website Visits')}
                subheader={t('Dashboard.Last Year')}
              />
              <AppUsersVisits
                title={t('Website Visits')}
                subheader={t('Dashboard.Last Year')}
              />
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default Dashboard;
