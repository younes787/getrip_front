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
        <MenuItem onClick={handleToggleSidebar}>
          <i className="pi pi-chart-line" style={{ fontSize: "1.3rem" }} />
        </MenuItem>
        <MenuItem onClick={() => navigate("/dashboard")}>
          <i className="pi pi-chart-bar mr-4" style={{ fontSize: "1.3rem" }} />{" "}
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => navigate("/users")}>
          {" "}
          <i className="pi pi-user mr-4"></i> Manage Users{" "}
        </MenuItem>
        <MenuItem onClick={() => navigate("/services-type")}>
          {" "}
          <i
            className="pi pi-file mr-4"
            style={{ fontSize: "1.3rem" }}
          ></i>{" "}
          Manage Services{" "}
        </MenuItem>
        <MenuItem onClick={() => navigate("/currency")}>
          {" "}
          <i
            className="pi pi-wallet mr-4"
            style={{ fontSize: "1.3rem" }}
          ></i>{" "}
          Manage Currency{" "}
        </MenuItem>
        <SubMenu
          label={
            <div>
              {" "}
              <i
                className="pi pi-globe  mr-4"
                style={{ fontSize: "1.3rem" }}
              ></i>{" "}
              Logistics
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/countries")}>
            <div>
              <i
                className="pi pi-globe  mr-4"
                style={{ fontSize: "1.3rem" }}
              ></i>
              Countries{" "}
            </div>
          </MenuItem>
          <MenuItem onClick={() => navigate("/provinces")}>
            <div>
              <i
                className="pi pi-globe  mr-4"
                style={{ fontSize: "1.3rem" }}
              ></i>
              Provinces{" "}
            </div>
          </MenuItem>
          <MenuItem onClick={() => navigate("/cities")}>
            <div>
              {" "}
              <i
                className="pi pi-globe  mr-4"
                style={{ fontSize: "1.3rem" }}
              ></i>{" "}
              Cities{" "}
            </div>
          </MenuItem>
        </SubMenu>
        <MenuItem onClick={() => navigate("/places")}>
          {" "}
          <i
            className="pi pi-building mr-4"
            style={{ fontSize: "1.3rem" }}
          ></i>{" "}
          Places{" "}
        </MenuItem>
        <SubMenu
          label={
            <div>
              {" "}
              <i
                className="pi pi-building mr-4"
                style={{ fontSize: "1.3rem" }}
              ></i>{" "}
              Residence
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/residence-type")}>
            {" "}
            <i
              className="pi pi-building mr-4"
              style={{ fontSize: "1.3rem" }}
            ></i>{" "}
            Residence Type{" "}
          </MenuItem>
          <MenuItem onClick={() => navigate("/residence")}>
            {" "}
            <i
              className="pi pi-building mr-4"
              style={{ fontSize: "1.3rem" }}
            ></i>{" "}
            Residences{" "}
          </MenuItem>
        </SubMenu>
        <SubMenu
          label={
            <div>
              {" "}
              <i
                className="pi pi-car mr-4"
                style={{ fontSize: "1.3rem" }}
              ></i>{" "}
              Vichels
            </div>
          }
        >
          <MenuItem onClick={() => navigate("/vehicle-type")}>
            {" "}
            <i
              className="pi pi-car mr-4"
              style={{ fontSize: "1.3rem" }}
            ></i>{" "}
            Vichels Type{" "}
          </MenuItem>
          <MenuItem onClick={() => navigate("/vehicle")}>
            {" "}
            <i
              className="pi pi-car mr-4"
              style={{ fontSize: "1.3rem" }}
            ></i>{" "}
            Vichels{" "}
          </MenuItem>
          <MenuItem onClick={() => navigate("/makers")}>
            {" "}
            <i
              className="pi pi-cog mr-4"
              style={{ fontSize: "1.3rem" }}
            ></i>{" "}
            Makers{" "}
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
