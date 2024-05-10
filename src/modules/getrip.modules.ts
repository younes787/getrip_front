
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
  country:string ='';
  city:string ='';
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
}

export class ServicesDTO {
  description: string = '';
  name: string = '';
}

export class CountriesDTO {
  id?: number = 0
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