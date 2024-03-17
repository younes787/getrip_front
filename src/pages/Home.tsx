import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import {  useState } from "react";
import Select from 'react-select';
import CountryList from 'react-select-country-list';

const Home = () =>{
    const options = CountryList().getData();
    const [date, setDate] = useState(null);
    const [date1, setDate1] = useState(null);

    return(
        <>
        <div className="">
        <div  className ="md:col-12 lg:col-12 md:w-full lg:w-full " id="imageContainer">
        <h2 className=" main-p-img ml-8 md:text-6xl lg:text-6xl">
        Wonderful Stay
    </h2>
    <h2 className="main2-p-img ml-8 md:text-6xl lg:text-6xl md:mt-7 lg:mt-7">
    For Your Dream Trip
    </h2>
    <Button className="main-btn-img ml-8 md:mt-8 lg:mt-8" label="Book Now" />
    </div>
    <div className="md:p-8 lg:p-8 p-2 md:pt-2 lg:pt-2 ">
    <div className="search-bar-wrapper md:flex lg:flex">
    <Button label="Search" style={{height:'60px'}} className="mr-3 mb-3"/>
     <Select
        options={options}
        placeholder="Select a country..."
        className="search-input mb-3"
      />     
     <Calendar className="date-input mb-3" value={date} onChange={(e:any) => setDate(e.value)} showIcon placeholder="Check-in" />
      <Calendar className="date-input mb-3" value={date1} onChange={(e:any) => setDate1(e.value)} showIcon placeholder="Check-out" />
      <InputText className="persons-input mb-3" placeholder="Persons" />
    </div>
    </div>
    
        </div>

        </>
    )

}

export default Home;