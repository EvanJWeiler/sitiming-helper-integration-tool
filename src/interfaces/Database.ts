export interface Race {
  id: string;
  name: string;
}

export interface Racer {
  id: string;
  name: string;
  teamName: string;
  bibNumber: number;
  categoryId: string;
  categoryName: string;
  checkedIn: boolean;
  cardNumber: number;
}

export interface Category {
  id: string;
  name: string;
  numRacers: number;
}

export interface Punch {
  id: string;
  cardNumber: number;
  controlCode: number;
  timeOfDay: Date;
}
