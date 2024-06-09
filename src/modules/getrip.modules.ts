

export class LoginDTO {
  username: string = "";
  password: string = "";
}

export class RegisterDTO {
  email: string = "";
  password: string = "";
  username: string = '';
  name: string = '';
  lastname: string = '';
  role: string = '';
  business: string = '';
  position:string ='';
  address:string ='';
  language:string ='';
  countryId: number = 0;
  cityId: number = 0;
  zipCode:string ='';
  taxNumber:string ='';
  phone:string ='';
  authorized: boolean = true;
}

export class UsersDTO {
  username: string = '';
  name: string = '';
  lastname: string = '';
  business: string = '';
  password: string = '';
  email: string = '';
  role: string = '';
  currencyId: number = 0;
}

export class ServicesTypeDTO {
  id?: number = 0;
  name: string = '';
  description: string = '';
  isRental: boolean = false;
  isTrip: boolean = false;
  isResidence: boolean = false;
  isVehicle: boolean = false;
  isCruise: boolean = false;
  isYacht: boolean = false;
  residenceTypeId?: number;
  vehicleTypeId?: number;
}

export class PricingDTO {
  serviceTypeId: number = 0;
  id?: number = 0;
  name: string = '';
}

export class CountriesDTO {
  id?: number = 0;
  taxRate: number = 0;
  countryCode: string = '';
  name: string = '';
}

export class CitiesDTO {
  id?: number = 0;
  description: string = '';
  name: string = '';
  provinceId?:number =0;
}

export class ProvincesDTO {
  id?: number = 0;
  name: string = '';
  countryId?:number;}

export class EditProvincesDTO {
  id?: number = 0;
  name: string = '';
  countryId?: number;
}

export class PlaceDTO {
  id?: number = 0;
  name: string = '';
  description: string = '';
  googleMapsUrl: string = '';
  lang: string = '';
  lot: string = '';
  cityId: number = 0;
}

export class VehicleDTO {
  id?: number = 0;
  model: string = '';
  isVip: boolean = false;
  passengersCount: number = 0;
  makerId?: number = 0;
  vehicleTypeId: number =0;
}

export class VehicleTypeDTO {
  id?: number = 0;
  name: string = '';
  description: string = '';
}

export class MakerDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
}

export class ActivityDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
  pLaceId?:number=0;
}

export class ServiceAttributeDTO{
  id?: number = 0;
  name: string = '';
  serviceTypeId?:number=0;
  fieldTypeId?:number=0;
}

export type File = {
  filename: string;
  data:string;
}

export class ImageDTO{
  objectId?: number = 0;
  file?: any;
}

export class ResidenceDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
  placeId?:number=0;
  residenceTypeId?:number=0;
}

export class ResidenceTypeDTO{
  id?: number = 0;
  name: string = '';
}

export class CurrencyDTO{
  id?: number = 0;
  name: string = '';
  price: number = 0;
  apiUrl?:string='';
  apiKey?:string='';
}
export class FildsDTO{
  id?: number = 0;
  value: any = '';
  serviceTypeFieldId: number = 0;
  serviceId: number = 0;
}
export class StepsDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
  cityId: number = 0;
  stepCount: number = 0;
  placeId: number = 0;
  serviceId: number = 0;
  hasNewPlace: boolean = false;
  newPLaceName: string ='';
  arrivalTime?: any
  departureTime?: any
}
export class stepsActivitiesDTO{
  id?: number = 0;
  newActivityName: string = '';
  stepId: number = 0;
  activityId: number = 0;
  hasNewActivity : boolean = true;
}
export class placeNewActivitiesDTO{
  pLaceId?: number = 0;
  name: string = '';
}
export class TagsDTO{
  id?: number = 0;
  name: any = '';
  serviceId: number = 0;
}
export class ServiceDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
  typeId?: any ;
  cityId?: number = 0;
  placeId?: number ;
  accountId:number=0;
  vehicleTypeId:number=0;
  residenceTypeId?:number;
  price:number=0;
  currencyId:number=0;
  isTrip:boolean= false;
  photos?: any[];
  placeHasNewActivities:boolean= false;
  hasNewRentalPlace :boolean= false;
  isRental:boolean= false;
  isActive:boolean= false;
  isArchived:boolean= false;
  isApproved:boolean= false;
  isYacht:boolean= false;
  isCruise:boolean= false;
  isVehicle:boolean= false;
  isResidence:boolean= false;
  rentalPlaceName:string= '';
  fields?: any;
  steps?: StepsDTO;
  stepsActivities?: stepsActivitiesDTO;
  placeNewActivities?: placeNewActivitiesDTO;
  tags?: TagsDTO | any;
}
