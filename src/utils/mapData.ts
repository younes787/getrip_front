import { Hotel, Flight, Restaurant, Service } from "../modules/getrip.modules";


export const mapHotelData = (data: any): Hotel[] => {
  return data.data.body.items
    .filter((item: any) => item.hotel)
    .map((item: any) => ({
      type: item.type,
      geolocation: item.geolocation,
      country: item.country,
      state: item.state,
      city: item.city,
      hotel: item.hotel,
      provider: item.provider,
      image: 'https://images.trvl-media.com/lodging/1000000/910000/902700/902656/6ebc6e2b.jpg',
    }));
};

export const mapFlightData = (data: any): Flight[] => {
  return data.data.body.items.map((item: any) => ({
    type: item.type,
    geolocation: item.geolocation,
    city: item.city,
    name: item.name,
    airport: item.airport,
    provider: item.provider,
    image: 'https://images.glints.com/unsafe/180x0/glints-dashboard.s3.amazonaws.com/company-logo/078ffae0e3450ba0fff918d12eb17aab.jpeg',
  }));
};

export const mapRestaurantData = (data: any): Restaurant[] => {
  return data.data.results.map((item: any) => ({
    business_status: item.business_status,
    geometry: item.geometry,
    icon: item.icon,
    name: item.name,
    opening_hours: item.opening_hours,
    photos: item.photos,
    place_id: item.place_id,
    price_level: item.price_level,
    rating: item.rating,
    isApproved: true,
    types: item.types,
    user_ratings_total: item.user_ratings_total,
    vicinity: item.vicinity,
    // image: 'https://cdn3.iconfinder.com/data/icons/diversity-avatars/64/chef-man-white-512.png',
    image: 'https://as2.ftcdn.net/v2/jpg/02/09/08/21/1000_F_209082136_p19UCUKbDeONvW0O5o0iTh59kEWWfutL.jpg',
  }));
};

export const mapServiceData = (data: any): Service[] => {
  return data.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    business: item.business,
    typeId: item.typeId,
    cityId: item.cityId,
    lat: item.lat,
    lng: item.lng,
    addressDescription: item.addressDescription,
    placeId: item.placeId,
    accountId: item.accountId,
    price: item.price,
    currencyId: item.currencyId,
    isActive: item.isActive,
    isArchived: item.isArchived,
    isApproved: item.isApproved,
    ratingAverage: item.ratingAverage,
    photos: item.photos,
    image: item?.photos[0]?.imagePath,
  }));
};
