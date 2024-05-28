import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import AvatarImage from "../Assets/Ellipse.png";
import { Fragment, useEffect, useState } from "react";
import StepWizard from "react-step-wizard";
import Wizard from "../components/Wizard";
import { GetAllServices } from "../Services";
import { Card } from "primereact/card";
import { Image } from "primereact/image";



const Profile = ()=>{
 const User = JSON.parse(localStorage?.getItem('user') as any) 
 const name = User?.data?.name + ' ' + User?.data?.lastname
 const email = User?.data?.email
 const [services, setServices] = useState<any>();

 useEffect(()=>{
   GetAllServices().then((res)=> setServices(res?.data))
 },[])
    return(
        <>
         <div id="imageContainer1">
          <div className="flex	">
            <div className="mt-4 ml-6">
            <Avatar
            image={AvatarImage}
            className="ml-8"
            shape="circle"
            style={{ width:'80px' , height:'80px' }}
          />
            </div>
            <div className="md:col-5 lg:col-5 ml-3">
              <h2 style={{color:'#4a235a'}}>{name}</h2>
              <h5 className="ml-1" style={{color:'#717171'}}>{email}</h5>
            </div>
          </div>
        </div>
        <div className="p-5	mt-4">
        <TabView className="tabView">
        <TabPanel
                  header={
                    <div>
                     My Services
                    </div>
                  }
                >
                            <div className="card grid gap-3 ">
                {services?.map((s:any)=>(
 <Card
 title={s.name}
 subTitle={s.description}
 header={ <Image  src={s?.photos[0]?.imagePath && s?.photos[0]?.imagePath } alt={s.photos}  preview />
}
 className="md:w-21rem"
>
 <div className="grid mb-0">
   <div className="col-8">
     <p>9.0/10</p>
     <p>(900 REVIEWS)</p>
     <Button icon="pi pi-info" rounded outlined aria-label="Filter"  size="small" severity="info"/>
   </div>
   <div className="col-4">
     <h3>{s?.price}</h3>
   </div>
 </div>
</Card>
           ))} 
           </div>
                </TabPanel>
                <TabPanel
                  header={
                    <div>
                     My Info
                    </div>
                  }
                >
                 
                </TabPanel>
                <TabPanel
                  header={
                    <div>
                      Add Services
                    </div>
                  }
                > 
             <Wizard/>     
                </TabPanel>
                <TabPanel
                  header={
                    <div>
                      Saved List
                    </div>
                  }
                > 
                </TabPanel>
              </TabView>
        </div>
      
        </>
    )

}

export default Profile;