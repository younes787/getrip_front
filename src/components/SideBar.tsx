import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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
          <i className="pi pi-chart-bar mr-3" style={{ fontSize: "1.3rem" }} />Dashboard
        </MenuItem>

        <MenuItem onClick={() => navigate("/users")}>
          <i className="pi pi-user mr-3"></i> Manage Users
        </MenuItem>

        <MenuItem onClick={() => navigate("/services-type")}>
          <i className="pi pi-file mr-3" style={{ fontSize: "1.3rem" }}></i>Manage Services Type
        </MenuItem>

        <MenuItem onClick={() => navigate("/currency")}>
          <i className="pi pi-wallet mr-3" style={{ fontSize: "1.3rem" }}></i>Manage Currency
        </MenuItem>

        <SubMenu label={
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i>Logistics
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/countries")}>
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i>Countries
            </div>
          </MenuItem>

          <MenuItem onClick={() => navigate("/provinces")}>
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i>Provinces
            </div>
          </MenuItem>

          <MenuItem onClick={() => navigate("/cities")}>
            <div>
              <i className="pi pi-globe  mr-3" style={{ fontSize: "1.3rem" }}></i>Cities
            </div>
          </MenuItem>

        </SubMenu>

        <MenuItem onClick={() => navigate("/places")}>
          <i className="pi pi-building mr-3" style={{ fontSize: "1.3rem" }}></i>Places
        </MenuItem>

        <SubMenu
          label={
            <div>
              <i className="pi pi-building mr-3"style={{ fontSize: "1.3rem" }}></i>Residence
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/residence-type")}>
            <i className="pi pi-building mr-3" style={{ fontSize: "1.3rem" }}></i>Residence Type
          </MenuItem>

          <MenuItem onClick={() => navigate("/residence")}>
            <i className="pi pi-building mr-3" style={{ fontSize: "1.3rem" }}></i>Residences
          </MenuItem>
        </SubMenu>

        <SubMenu
          label={
            <div>
              <i className="pi pi-car mr-3" style={{ fontSize: "1.3rem" }}></i>Vehicles
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/vehicle-type")}>
            <i className="pi pi-car mr-3"style={{ fontSize: "1.3rem" }}></i>Vehicles Type
          </MenuItem>

          <MenuItem onClick={() => navigate("/vehicle")}>
            <i className="pi pi-car mr-3" style={{ fontSize: "1.3rem" }}></i>Vehicles
          </MenuItem>

          <MenuItem onClick={() => navigate("/makers")}>
            <i className="pi pi-cog mr-3" style={{ fontSize: "1.3rem" }}></i>Makers
          </MenuItem>

        </SubMenu>

        <SubMenu
          label={
            <div>
              <i className="pi pi-eject mr-3" style={{ fontSize: "1.3rem" }}></i>Facility
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/facility-categories")}>
            <i className="pi pi-tag mr-3"style={{ fontSize: "1.3rem" }}></i>Facility Categories
          </MenuItem>

          <MenuItem onClick={() => navigate("/facility")}>
            <i className="pi pi-eject mr-3" style={{ fontSize: "1.3rem" }}></i>Facility
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
