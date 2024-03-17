import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faEdit, faPlane, faTaxi, faTrashAlt, faTree } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from "primereact/avatar";
import user from '../Assets/user.svg'
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const NavBar = () =>{
    const menuLeft = useRef<any>(null);
     const navigate = useNavigate()
    const itemRenderer = (item:any) => (
        <a className="flex align-items-center p-menuitem-link">
            <FontAwesomeIcon icon={faCar}/>
            <span className="mx-2">{item.label}</span>
        </a>
    );
    const PlaneRender =  (item:any) => (
        <a className="flex align-items-center p-menuitem-link">
            <FontAwesomeIcon icon={faPlane}/>
            <span className="mx-2">{item.label}</span>
        </a>
    );
    const TaxiRender = (item:any) => (
        <a className="flex align-items-center p-menuitem-link">
            <FontAwesomeIcon icon={faTaxi}/>
            <span className="mx-2">{item.label}</span>
        </a>
    );
    const TreeRender = (item:any) => (
        <a className="flex align-items-center p-menuitem-link">
            <FontAwesomeIcon icon={faTree}/>
            <span className="mx-2">{item.label}</span>
        </a>
    );
    const items = [
        {
            label: 'Air Flights',
            icon: <FontAwesomeIcon icon={faPlane}/> ,
            template: PlaneRender
        },
        {
            label: 'Renting Cars',
            icon: 'pi pi-star',
            template: itemRenderer
        },
        {
            label: 'Airport taxi',
            icon: 'pi pi-envelope',
            template: TaxiRender
        },
        {
            label: 'Tourism',
            icon: 'pi pi-envelope',
            template: TreeRender
        }
    ];
    const Menuitems = [
        {
            label: 'Dania',
            items: [
                {
                    label: 'My Profile',
                    icon: 'pi pi-user',
                },
                {
                    label: 'Log Out',
                    icon: 'pi pi-sign-out',
                    command:() => navigate('/login')
                }
            ]
        }
    ];
    const end = (
        <div className="flex align-items-center gap-2 mr-2">
            <Avatar image={user} onClick={(event) => menuLeft.current.toggle(event)} shape="circle" />
        </div>
    );
    return(
        <div className="card">
        <Menu model={Menuitems} popup ref={menuLeft} className="popup-left"  />
        <Menubar model={items} end={end} start={<span style={{fontWeight:'bold'}}>Travel</span>}  className="navbar navbar_items" />
    </div>
    )

}

export default NavBar;