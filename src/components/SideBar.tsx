import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sidebar collapsed={collapsed} className="siderbar">
      <Menu>
        <MenuItem
          onClick={handleToggleSidebar}
          className="flex justify-content-end text-white handle-toggle-sidebar m-1 p-0"
          icon={
            <i className="pi pi-times border-white border-1 p-2" style={{ fontSize: ".7rem", borderRadius: '50%' }} />
          }
        >
        </MenuItem>

        <MenuItem onClick={() => navigate("/dashboard")}>
          <i className="pi pi-chart-bar mr-3" style={{ fontSize: "1.3rem" }} /> {t('sidbar.Dashboard')}
        </MenuItem>

        <MenuItem onClick={() => navigate("/users")}>
          <i className="pi pi-user mr-3"></i>  {t('sidbar.Manage Users')}
        </MenuItem>

        <MenuItem onClick={() => navigate("/services-type")}>
          <i className="pi pi-file mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Manage Services Type')}
        </MenuItem>

        <MenuItem onClick={() => navigate("/currency")}>
          <i className="pi pi-wallet mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Manage Currency')}
        </MenuItem>

        <MenuItem onClick={() => navigate("/home-page-content")}>
          <i className="pi pi-home mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Manage Home Page Content')}
        </MenuItem>

        <SubMenu label={
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Logistics')}
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/countries")}>
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Countries')}
            </div>
          </MenuItem>

          <MenuItem onClick={() => navigate("/provinces")}>
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Provinces')}
            </div>
          </MenuItem>

          <MenuItem onClick={() => navigate("/cities")}>
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Cities')}
            </div>
          </MenuItem>

        </SubMenu>

        <MenuItem onClick={() => navigate("/places")}>
          <i className="pi pi-building mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Places')}
        </MenuItem>

        <SubMenu
          label={
            <div>
              <i className="pi pi-building mr-3"style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Residence')}
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/residence-type")}>
            <i className="pi pi-building mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Residence Type')}
          </MenuItem>

          <MenuItem onClick={() => navigate("/residence")}>
            <i className="pi pi-building mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Residences')}
          </MenuItem>
        </SubMenu>

        <SubMenu
          label={
            <div>
              <i className="pi pi-car mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Vehicles')}
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/vehicle-type")}>
            <i className="pi pi-car mr-3"style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Vehicles Type')}
          </MenuItem>

          <MenuItem onClick={() => navigate("/vehicle")}>
            <i className="pi pi-car mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Vehicles')}
          </MenuItem>

          <MenuItem onClick={() => navigate("/makers")}>
            <i className="pi pi-cog mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Makers')}
          </MenuItem>

        </SubMenu>

        <SubMenu
          label={
            <div>
              <i className="pi pi-eject mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Facility')}
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/facility-categories")}>
            <i className="pi pi-tag mr-3"style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Facility Categories')}
          </MenuItem>

          <MenuItem onClick={() => navigate("/facility")}>
            <i className="pi pi-eject mr-3" style={{ fontSize: "1.3rem" }}></i> {t('sidbar.Facility')}
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
