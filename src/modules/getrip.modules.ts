
export class LoginDTO {
  email: string = "";
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
  value: string = '';
  serviceTypeId?:number=0;
}

export class PlaceImageDTO{
  id?: number = 0;
  imagePath: string = '';
  placeId?:number=0;
}

export class ResidenceDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
  placeId?:number=0;
  residenceTypeId?:number=0;
}
export type PhotosDTO={
  id?: number 
  imagePath: string 
  imageData: string
  residenceId:number
}
export class UpdateResidenceDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
  placeId?:number=0;
  residenceTypeId?:number=0;
  photos?:PhotosDTO
}

export class ResidenceTypeDTO{
  id?: number = 0;
  name: string = '';
}