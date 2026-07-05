import api from "./axios";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data.products;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data.products;
};