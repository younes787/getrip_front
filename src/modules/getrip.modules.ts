

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

export class RegisterServiceProviderDTO {
  name: string = "";
  lastname: string = "";
  password: string = "";
  email: string = "";
  business: string = "";
  position: string = "";
  countryId: number = 0;
  provincId: number = 0;
  cityId: number = 0;
  address: string  = "";
  zipCode: string = "";
  languageId: number = 0;
  phone: string = "";
  taxNumber: string = "";
  currencyId: number = 0;
  accountId: number = 0;
  token: string = "";
  expiration: any = "";
  authorized: boolean = true;
  role: string = "";
  allowedServiceTypes: AllowedServiceTypesDTO[] = []
}

export class AllowedServiceTypesDTO {
  id?: number = 0;
  serviceTypeId?: number = 0;
  accountId: string = '';
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
  icon: string = '';
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
  countryId?:number;
}

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

export class FacilityDTO {
  id?: number = 0;
  name: string = '';
  categoryId: number = 0;
}

export class VehicleTypeDTO {
  id?: number = 0;
  name: string = '';
  description: string = '';
}

export class AssignFaciliesToServiceTypeDTO {
  id?: number = 0;
  serviceTypeId: number = 0;
  facilityId: number = 0;
}

export class FacilityCategotiesDTO {
  id?: number = 0;
  name: string = '';
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
  newPlaceName: string ='';
  arrivalTime?: any;
  departureTime?: any;
  countryId?: number = 0;
  provincyId?: number = 0;
}

export class HomePageRowDTO{
  pageId?: number = 0;
  title: string = '';
  description: string = '';
  placement: number = 0;
  columnsCount: number = 0;
  itemsCount: number = 0;
  isSlider: boolean = false;
  isService: boolean = false;
  filterByProvinceId: boolean = false;
  filterByCityId: boolean = false;
  isPlace: boolean = false;
  isActivity: boolean = false;
  isAd: boolean = false;
  isOnlyImage: boolean = false;
  serviceTypeId: number = 0;
  cityId: number = 0;
  provinceId: number = 0;
  isBanner: boolean = false;
}

export class stepsActivitiesDTO{
  id?: number = 0;
  newActivityName: string = '';
  stepId: number = 0;
  activityId: number = 0;
  hasNewActivity : boolean = true;
}

export class ImageToRowDTO{
  ObjectId: number = 0;
  file: string | any = null;
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

export class ServiceFacilitiesDTO{
  serviceTypeFacilityId: number = 0;
  name?: string = '';
  serviceId?: number = 0;
  isPrimary: boolean = false;
  isAdditionalCharges: boolean = false;
}

export interface Address {
  lat?: number;
  lng?: number;
  country?: string;
  province?: string;
  city?: string;
  description?: string;
}

export interface SidebarFilter {
  residence: any[];
  residence_type: any[];
  city: any[];
  range_price: any[];
  rating: any[];
  currency: any[];
}

export interface QueryFilter {
  selectdTab?: any;
  address?: any;
  startDate?: Date;
  endDate?: Date;
  selectedFields?: FildsDTO[];
  sidebarFilter?: SidebarFilter;
  guests: number;
  departureCity: any;
  arrivalCity: any;
  departureDate: Date;
  returnDate: Date;
  flightServiceType: any;
}
export interface LocationFromMap {
  lat: number;
  lng: number;
  address: any
}

export interface LocationFromSearch {
  lat: number;
  lng: number;
  country: string;
  province: string
}

export class ServiceDTO{
  id?: number = 0;
  name: string = '';
  description: string = '';
  typeId?: any ;
  cityId?: number = 0;
  countryId?: number = 0;
  provincyId?: number = 0;
  placeId?: number ;
  accountId:number=0;
  vehicleTypeId:number=0;
  residenceTypeId?:number;
  price:number=0;
  ratingAverage:number=0;
  currencyId:number=0;
  isTrip:boolean = false;
  photos?: any[];
  images?: {};
  address?: Address;
  placeHasNewActivities:boolean = false;
  hasNewRentalPlace :boolean = false;
  isRental:boolean = false;
  isTaxIncluded:boolean = false;
  isActive:boolean = false;
  isArchived:boolean = false;
  isApproved:boolean = false;
  isYacht:boolean = false;
  isCruise:boolean = false;
  isVehicle:boolean = false;
  isResidence:boolean = false;
  rentalPlaceName:string = '';
  fields?: any;
  steps?: StepsDTO[];
  stepsActivities?: stepsActivitiesDTO;
  placeNewActivities?: placeNewActivitiesDTO;
  tags?: TagsDTO | any;
  serviceFacilities?: ServiceFacilitiesDTO[] = [];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  business: string;
  typeId: number;
  cityId: number;
  lat: number | null;
  lng: number | null;
  addressDescription: string | null;
  placeId: string | null;
  accountId: number;
  price: number;
  currencyId: number;
  isActive: boolean;
  isArchived: boolean;
  isApproved: boolean;
  ratingAverage: number;
  image: string;
}

export interface Hotel {
  type: number;
  geolocation: {
    longitude: string;
    latitude: string;
  };
  country: {
    id: string;
    name: string;
  };
  state: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
  hotel: {
    id: string
    internationalName: string
    name:string
  };
  name?: string;
  provider: number;
  image: string;
}

export interface Flight {
  type: number;
  geolocation: {
    longitude: string;
    latitude: string;
  };
  city?: {
    id: string;
    name: string;
  };
  airport: {
    id: string;
    name: string;
  };
  name?: string;
  provider: number;
  image: string;
}

export interface Restaurant {
  business_status: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  icon: string;
  name: string;
  opening_hours: {
    open_now: boolean;
  };
  image: string;
  place_id: string;
  price_level: number;
  rating: number;
  isApproved: boolean,
  user_ratings_total: number;
  vicinity: string;
  types: string[] | any;
}
