import { Button } from "primereact/button";
import imgcard from '../Assets/b.png'
import imgcard1 from '../Assets/3.png'
import imgcard2 from '../Assets/R1.png'
import imgcard3 from '../Assets/R2.png'
import imgcard4 from '../Assets/R3.png'
import imgcard5 from '../Assets/R4.png'


import '../styles/Searchbar.scss'
import { TabPanel, TabView } from "primereact/tabview";
import { Image } from 'primereact/image';
import { Card } from "primereact/card";
const Home = () =>{
   const header = (
      <img alt="Card" src={imgcard2} />
  );
  const header2 = (
   <img alt="Card" src={imgcard3} />
);
const header3 = (
   <img alt="Card" src={imgcard4} />
);
const header4 = (
   <img alt="Card" src={imgcard5} />
);

    return(
        <>
        <div className="overflow-hidden">
         <div  id="imageContainer">
        <div  className ="md:col-12 lg:col-12 md:w-full lg:w-full text-center 	">
        <h1 className="mt-6 get-rp"> Get Your Trip With Ge<span className="secondery">t</span>rip</h1>
        <div className="md:w-7 lg:w-7 Searchcard text-center mt-4">
            <TabView>
                <TabPanel header={<div><span><i className="pi pi-search mr-2"></i> Search All </span> </div>} >
                <div className="search__bar justify-content-center	">
         <form className='grid justify-content-center gap-4'>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className='ml-4 pi pi-map-marker'></i></span>
               <div>
                  <input type="text" className="mt-3" placeholder='Search By Hotel Name' />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className=''></i></span>
               <div>
                  <input type="datetime-local" className="mt-3"  placeholder='Date'  />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-last'>
               <span><i className='ri-group-line'></i></span>
               <div>
                  <input type="number" className="mt-4"  placeholder='0'  />
               </div>
            </div>

            <span className='search__icon' >
            <Button label="Search" rounded  severity="warning" className="mt-2"  />
            </span>
         </form>
      </div>
                </TabPanel>
                <TabPanel  header={<div><span><i className="pi pi-building mr-2"></i> Yacht BookingsS </span> </div>}>
                <div className="search__bar justify-content-center	">
         <form className='grid justify-content-center gap-4'>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className='ml-4 pi pi-map-marker'></i></span>
               <div>
                  <input type="text" className="mt-3" placeholder='Search By Hotel Name' />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className=''></i></span>
               <div>
                  <input type="datetime-local" className="mt-3"  placeholder='Date'  />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-last'>
               <span><i className='ri-group-line'></i></span>
               <div>
                  <input type="number" className="mt-4"  placeholder='0'  />
               </div>
            </div>

            <span className='search__icon' >
            <Button label="Search" rounded  severity="warning" className="mt-2"  />
            </span>
         </form>
      </div>
                </TabPanel>
                <TabPanel header={<div><span><i className="pi pi-building mr-2"></i> Restaurants </span> </div>}>
                <div className="search__bar justify-content-center	">
         <form className='grid justify-content-center gap-4'>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className='ml-4 pi pi-map-marker'></i></span>
               <div>
                  <input type="text" className="mt-3" placeholder='Search By Hotel Name' />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className=''></i></span>
               <div>
                  <input type="datetime-local" className="mt-3"  placeholder='Date'  />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-last'>
               <span><i className='ri-group-line'></i></span>
               <div>
                  <input type="number" className="mt-4"  placeholder='0'  />
               </div>
            </div>

            <span className='search__icon' >
            <Button label="Search" rounded  severity="warning" className="mt-2"  />
            </span>
         </form>
      </div>
                </TabPanel>
                <TabPanel header={<div><span><i className="pi pi-car mr-2"></i> Cottages </span> </div>}>
                <div className="search__bar justify-content-center	">
         <form className='grid justify-content-center gap-4'>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className='ml-4 pi pi-map-marker'></i></span>
               <div>
                  <input type="text" className="mt-3" placeholder='Search By Hotel Name' />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className=''></i></span>
               <div>
                  <input type="datetime-local" className="mt-3"  placeholder='Date'  />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-last'>
               <span><i className='ri-group-line'></i></span>
               <div>
                  <input type="number" className="mt-4"  placeholder='0'  />
               </div>
            </div>

            <span className='search__icon' >
            <Button label="Search" rounded  severity="warning" className="mt-2"  />
            </span>
         </form>
      </div>
                </TabPanel>
              
                <TabPanel  header={<div><span><i className="pi pi-caret-down mr-2"></i> Packages </span> </div>}>
                <div className="search__bar justify-content-center	">
         <form className='grid justify-content-center gap-4'>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className='ml-4 pi pi-map-marker'></i></span>
               <div>
                  <input type="text" className="mt-3" placeholder='Search By Hotel Name' />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-fast'>
               <span><i className=''></i></span>
               <div>
                  <input type="datetime-local" className="mt-3"  placeholder='Date'  />
               </div>
            </div>
            <div className='grid gap-3 form__group form__group-last'>
               <span><i className='ri-group-line'></i></span>
               <div>
                  <input type="number" className="mt-4"  placeholder='0'  />
               </div>
            </div>

            <span className='search__icon' >
            <Button label="Search" rounded  severity="warning" className="mt-2"  />
            </span>
         </form>
      </div>
                </TabPanel>
            </TabView>
        </div>
    </div>
        </div>
         <div className="grid gap-8 ml-7	align-content-center">
<Image src={imgcard}  preview />
<Image src={imgcard1}  preview />

         </div>
         <div className="ml-7">
         <h2 className="black">Last-minute weekend deals</h2>
         <div className="card grid gap-3 ">
            <Card title="Grand Bosphorus Hotel" subTitle="Sultanahmet District"  header={header} className="md:w-21rem">
               <div className="grid mb-0">
               <div className="col-8">
               <p>9.0/10</p>
               <p>(900 REVIEWS)</p>
               </div>
               <div className="col-4"  >
               <p>Per Night</p>
               <h3>$199</h3>
               <p>($244)</p>
               </div>
               </div>
            </Card>
            <Card title="Blue Mosque Suites" subTitle="Old City, near the Blue Mosque"  header={header2} className="md:w-21rem">
               <div className="grid mb-0">
               <div className="col-8">
               <p>9.0/10</p>
               <p>(900 REVIEWS)</p>
               </div>
               <div className="col-4"  >
               <p>Per Night</p>
               <h3>$199</h3>
               <p>($244)</p>
               </div>
               </div>
            </Card>
            <Card title="Golden Horn Inn" subTitle="Sultanahmet District"  header={header3} className="md:w-21rem">
               <div className="grid mb-0">
               <div className="col-8">
               <p>9.0/10</p>
               <p>(900 REVIEWS)</p>
               </div>
               <div className="col-4"  >
               <p>Per Night</p>
               <h3>$199</h3>
               <p>($244)</p>
               </div>
               </div>
            </Card>
            <Card title="Ottoman Palace Taksim" subTitle="Sultanahmet District"  header={header4} className="md:w-21rem">
               <div className="grid mb-0">
               <div className="col-8">
               <p>9.0/10</p>
               <p>(900 REVIEWS)</p>
               </div>
               <div className="col-4"  >
               <p>Per Night</p>
               <h3>$199</h3>
               <p>($244)</p>
               </div>
               </div>
            </Card>
        </div>
        <h2 className="black mt-7">Explore your travel opportunities with GETIP!</h2>
         </div>

        </div>

        </>
    )

}

export default Home;