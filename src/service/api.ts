import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { Character, Info } from "../interfaces";

const api = axios.create({ baseURL: "https://rickandmortyapi.com/api" });

export async function getCharacters(name?: string): Promise<{
  info: Info;
  results: Character[];
}> {
  return await api
    .request({ method: "GET", url: "character", params: { name } })
    .then((response) => response.data)
    .catch((error) => {
      if (isAxiosError(error)) {
        throw error;
      }
      throw new Error("unknown error");
    });
}

export function useGetCharacters(search?: string) {
  return useQuery({
    queryKey: ["characters", search ?? "all"],
    queryFn: () => getCharacters(search),
  });
}
