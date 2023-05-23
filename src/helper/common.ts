export interface Breed {
  id: string, // e.g. 'abys'
  description: string,
  name: string,
  origin: string,
  temperament: string,
}

export interface Cat {
  id: string, // e.g. 'EHG3sOpAM'
  breeds?: ReadonlyArray<Breed>,
  height: number,
  url: string,
  width: number,
}
