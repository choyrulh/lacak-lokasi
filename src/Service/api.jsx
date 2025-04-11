import axios from "axios";

const api_key = "b21eda71e3508823f3a70e04e795213b";
const axiosCreate = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  api_key: "b21eda71e3508823f3a70e04e795213b",
});

export const getSearch = async (q) => {
  const response = await axiosCreate.get(
    `/search/movie?api_key=${api_key}&query=${q}&page=1&`
  );
  return response.data;
};
