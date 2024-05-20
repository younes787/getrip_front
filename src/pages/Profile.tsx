import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import AvatarImage from "../Assets/Ellipse.png";
import { Fragment, useState } from "react";
import StepWizard from "react-step-wizard";
import Wizard from "../components/Wizard";



const Profile = ()=>{
 const User = JSON.parse(localStorage?.getItem('user') as any) 
 const name = User?.data?.name + ' ' + User?.data?.lastname
 const email = User?.data?.email

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
        <div className="grid justify-content-center	mt-4">
        <TabView>
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
                     My Services
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