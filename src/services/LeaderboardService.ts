import { Punch } from 'interfaces/Database';
import { BasicPunch, GroupedPunches, Results } from 'interfaces/Schema';

// group list of punches into a map of cardNumber to punch list
const groupPunchesByCardNumber = (punchList: Punch[]): GroupedPunches => {
  const groupedPunches: GroupedPunches = {};

  punchList.forEach((punch: Punch) => {
    if (!groupedPunches[punch.cardNumber]) {
      groupedPunches[punch.cardNumber] = [
        {
          controlCode: punch.controlCode,
          timeOfDay: new Date(punch.timeOfDay),
        },
      ];
    } else {
      groupedPunches[punch.cardNumber].push({
        controlCode: punch.controlCode,
        timeOfDay: new Date(punch.timeOfDay),
      });
    }
  });

  return groupedPunches;
};

// iterate through and delete all extraneous punches (leniency biased)
const normalizePunches = (punches: GroupedPunches) => {
  const cardNumbers = Object.keys(punches);

  cardNumbers.forEach((cardNumber) => {
    const punchList: BasicPunch[] = punches[cardNumber];
    const goodPunches: BasicPunch[] = [];

    let i = 0;
    while (i < punchList.length) {
      let lastIndex = i;
      let j = i;
      while (punchList.at(i)?.controlCode === punchList.at(j)?.controlCode) {
        lastIndex = j;
        j += 1;

        if (!punchList.at(j)) break;
      }

      const currControlCode = punchList.at(i)?.controlCode ?? 0;
      if (currControlCode % 10 === 0) {
        goodPunches.push(punchList.at(lastIndex) as BasicPunch);
      } else {
        goodPunches.push(punchList.at(i) as BasicPunch);
      }

      i = lastIndex + 1;
    }
    punches[cardNumber] = goodPunches;
  });
};

const calculateStageTimes = (punches: GroupedPunches): Results => {
  const cardNumbers = Object.keys(punches);
  const resultMap = {} as Results;

  cardNumbers.forEach((cardNumber) => {
    const currPunches = punches[cardNumber];

    const stageResults = [];

    for (let i = 0; i < currPunches.length; i += 2) {
      if (!currPunches.at(i + 1)) {
        stageResults.push({
          stageNum: currPunches.at(i)!.controlCode / 10,
          stageTime: -1,
        });
      } else {
        stageResults.push({
          stageNum: currPunches.at(i)!.controlCode / 10,
          stageTime:
            currPunches.at(i + 1)!.timeOfDay.valueOf() -
            currPunches.at(i)!.timeOfDay.valueOf(),
        });
      }
    }

    let totalTime = 0;
    stageResults.forEach((result) => {
      if (result.stageTime) totalTime += result.stageTime;
    });

    stageResults.unshift({
      stageNum: 0,
      stageTime: totalTime,
    });

    resultMap[cardNumber] = stageResults;
  });

  return resultMap;
};

const getStageTimesByCardNumber = (raceId: string): Promise<Results> => {
  return fetch(`http://localhost:8085/api/punches?raceId=${raceId}`)
    .then((res) => res.json())
    .then((res) => {
      const punches = groupPunchesByCardNumber(res);
      normalizePunches(punches);
      const results = calculateStageTimes(punches);

      return results;
    })
    .catch((err) => {
      throw err;
    });
};

export default getStageTimesByCardNumber;
