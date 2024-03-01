export interface ServerSettings {
  address: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

export interface BasicPunch {
  controlCode: number;
  timeOfDay: Date;
}

export interface GroupedPunches {
  [cardNumber: string]: BasicPunch[];
}

export interface CalculatedPunch {
  stageNum: number;
  stageTime: number;
}

export interface Results {
  [cardNumber: string]: CalculatedPunch[];
}
