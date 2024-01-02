import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { Character, Info } from "../interfaces";

const api = axios.create({ baseURL: "https://rickandmortyapi.com/api" });

export async function getCharacters(params: {
  name: string;
  page?: string;
}): Promise<{
  info: Info;
  results: Character[];
}> {
  return await api
    .request({ method: "GET", url: "character", params })
    .then((response) => response.data)
    .catch((error) => {
      if (isAxiosError(error)) {
        const err = new Error(error.response?.data?.error ?? error.message);
        err.name = error.name;
        throw err;
      }
      throw new Error("unknown error");
    });
}

export function useGetCharacters(search = "") {
  return useQuery({
    queryKey: ["characters", search],
    queryFn: () => getCharacters({ name: search }),
    retry: 1,
  });
}
