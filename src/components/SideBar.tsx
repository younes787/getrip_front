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
          <i
            className="pi pi-chart-line"
            style={{ fontSize: "1.3rem" }}
          />
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
        <MenuItem>
          {" "}
          <i
            className="pi pi-wallet mr-4"
            style={{ fontSize: "1.3rem" }}
          ></i>{" "}
          Manage Payments{" "}
        </MenuItem>
        <SubMenu label={<div> <i
            className="pi pi-globe  mr-4"
            style={{ fontSize: "1.3rem" }}
          ></i> Logistics</div>}>
        <MenuItem onClick={() => navigate("/countries")}>
         Countries {" "}
        </MenuItem>
        <MenuItem onClick={() => navigate("/provinces")}>
         Provinces {" "}
        </MenuItem>
        <MenuItem onClick={() => navigate("/cities")}>
         Cities {" "}
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
        <MenuItem>
          {" "}
          <i
            className="pi pi-car mr-4"
            style={{ fontSize: "1.3rem" }}
          ></i>{" "}
          Vichels{" "}
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
