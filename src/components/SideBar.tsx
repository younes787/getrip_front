import { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';

const SideBar = () =>{
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()

    const handleToggleSidebar = () => {
      setCollapsed(!collapsed);
    };
    return(
        <Sidebar collapsed={collapsed} className='siderbar'>
         <Menu >
         <MenuItem onClick={handleToggleSidebar}> 
         <i className='pi pi-chart-line' style={{color:'#4a235a' , fontSize:'1.3rem'}}/></MenuItem>
      <MenuItem onClick={()=>navigate('/users')}> <i className='pi pi-user mr-4'></i> Manage Users </MenuItem>
      <MenuItem> <i className='pi pi-file mr-4' style={{color:'#4a235a' , fontSize:'1.3rem'}}></i> Manage Services </MenuItem>
      <MenuItem> <i className='pi pi-wallet mr-4' style={{color:'#4a235a' , fontSize:'1.3rem'}}></i> Manage Payments </MenuItem>

  </Menu>
      </Sidebar>
    )
}

export default SideBar;


