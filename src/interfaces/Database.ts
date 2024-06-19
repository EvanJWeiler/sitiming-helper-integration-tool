export interface Race {
  id: string;
  name: string;
}

export interface RaceInfo {
  id: string;
  name: string;
  totalRacers: number;
  racersOnCourse: number;
}

export interface RacerStatus {
  id: string;
  bibNumber: number;
  racerName: string;
  cardNumber: number;
  teamName: string;
  checkedIn: boolean;
  categoryName: string;
}

export interface RacerResult {
  id: string;
  bibNumber: number;
  racerName: string;
  teamName: string;
  [stageNumber: number]: number;
}

export interface CategoryWithStatus {
  id: string;
  name: string;
  totalRacers: number;
  racersOnCourse: number;
}

export interface Stage {
  code: string;
  label: string;
}

export interface CategoryWithStages {
  id: string;
  name: string;
  stageList: Array<Stage>;
}

export interface Punch {
  id: string;
  cardNumber: number;
  controlCode: number;
  timeOfDay: Date;
}
