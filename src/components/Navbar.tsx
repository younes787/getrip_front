import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faEdit, faPlane, faTaxi, faTrashAlt, faTree } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from "primereact/avatar";
import user from '../Assets/user.svg'
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
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
        <div className="flex align-items-center gap-2 mr-7">
            {/* <Avatar image={user} onClick={(event) => menuLeft.current.toggle(event)} shape="circle" /> */}
            <Button rounded label="Become A Partner" outlined className="outline_btn" />
            <Button rounded label="Account" icon="pi pi-user" onClick={()=>navigate('/login')} className="pr_btn"/>

        </div>
    );
    return(
        <div className="card">
        <Menu model={Menuitems} popup ref={menuLeft} className="popup-left"  />
        <Menubar  end={end} start={<span className="ml-6 text-2xl get-rp">Ge<span className="secondery">t</span>rip</span>} className="navbar"  />
    </div>
    )

}

export default NavBar;