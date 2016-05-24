export interface IPreferences {
  uci: {
      msPerMove: number
  }
}

export class User {
  public preferences: IPreferences;
  
  constructor(
    public id: number,
    public email: string,
    public password: string
  ) {  }
}