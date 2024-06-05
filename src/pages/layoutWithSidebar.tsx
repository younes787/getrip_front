import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar';
import '../styles/LayoutSidebar.scss';

const LayoutWithSidebar = () => (
  <div className="layout-with-sidebar">
    <SideBar />
    <div className="content-with-offset" style={{ overflowY: 'scroll', overflowX: 'hidden'}}>
      <Outlet />
    </div>
  </div>
);

export default LayoutWithSidebar;
