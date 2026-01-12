export class Breed {
  constructor(
    public id: string,
    public name: string,
    public origin?: string,
    public temperament?: string,
    public description?: string,
    public life_span?: string,
    public weight?: { imperial: string; metric: string },
    public wikipedia_url?: string
  ) {}
}
