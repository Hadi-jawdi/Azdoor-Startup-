// // export const listings = [
// //   {
// //     id: "1",
// //     title: "آپارتمان ۳ اتاقه در شهر نو",
// //     price: "۴۵,۰۰۰ افغانی",
// //     location: "کابل، شهر نو",
// //     category: "املاک",
// //   },
// //   {
// //     id: "2",
// //     title: "موتر تویوتا کرولا ۲۰۱۵",
// //     price: "۹۰۰,۰۰۰ افغانی",
// //     location: "کابل، دشت برچی",
// //     category: "وسایط نقلیه",
// //   },
// //   {
// //     id: "3",
// //     title: "موبایل سامسونگ گلکسی S21",
// //     price: "۲۵,۰۰۰ افغانی",
// //     location: "هرات",
// //     category: "دیجیتال",
// //   },
// // ];

// export const listings = [
//   {
//     id: "1",
//     title: "آپارتمان ۳ اتاقه در شهر نو",
//     price: "۴۵,۰۰۰ افغانی",
//     location: "کابل، شهر نو",
//     category: "املاک",
//     categoryId: "real-estate",
//     description: "آپارتمان ۳ اتاقه، طبقه دوم، دارای پارکینگ و آسانسور.",
//   },
//   {
//     id: "2",
//     title: "موتر تویوتا کرولا ۲۰۱۵",
//     price: "۹۰۰,۰۰۰ افغانی",
//     location: "کابل، دشت برچی",
//     category: "وسایط نقلیه",
//     categoryId: "vehicles",
//     description: "موتر سالم، بدون رنگ، کارکرد کم.",
//   },
//   {
//     id: "3",
//     title: "موبایل سامسونگ گلکسی S21",
//     price: "۲۵,۰۰۰ افغانی",
//     location: "هرات",
//     category: "دیجیتال",
//     categoryId: "digital",
//     description: "استفاده شده، وضعیت عالی، همراه با شارژر اصلی.",
//   },
// ];
import { apiRequest } from "./api";

export function getListings(categoryId) {
  const query = categoryId ? `?category=${categoryId}` : "";
  return apiRequest(`/listings/${query}`);
}

export function getListing(id) {
  return apiRequest(`/listings/${id}/`);
}

export function createListing(data, token) {
  return apiRequest("/listings/", { method: "POST", body: data, token });
}