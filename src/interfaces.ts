export interface Character {
  id: number;
  name: string;
  image: string;
  episode: string[];
}

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}
