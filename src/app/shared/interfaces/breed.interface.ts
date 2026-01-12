export interface IBreed {
  id: string;
  name: string;
  origin?: string;
  temperament?: string;
  description?: string;
  life_span?: string;
  weight?: {
    imperial: string;
    metric: string;
  };
  wikipedia_url?: string;
}

export interface IBreedSearchResponse {
  breeds: IBreed[];
}
