// 좌석 타입 정의
export interface SeatType {
  id: string;
  label?: string;
  empty?: boolean;
}

// 좌석 데이터 - 실제 배치도와 동일하게 구성
export const seats = {
  // 상고구역 1
  upperOne: [
    { id: "UO1" },
    { id: "UO2" },
    { id: "UO3" },
    { id: "UO4" },
    { id: "UO5" },
    { id: "UO6" },
  ],
  // 상고구역 2
  upperTwo: [
    { id: "UT1" },
    { id: "UT2" },
    { id: "UT3", empty: true },
    { id: "UT4" },
    { id: "UT5" },
    { id: "UT6" },
  ],
  // 상고구역 3
  upperThree: [
    { id: "UTh1" },
    { id: "UTh2" },
    { id: "UTh3" },
    { id: "UTh4", empty: true },
    { id: "UTh5" },
    { id: "UTh6" },
  ],
  // 상고구역 4
  upperFour: [
    { id: "UF1" },
    { id: "UF2" },
    { id: "UF3" },
    { id: "UF4" },
    { id: "UF5" },
    { id: "UF6" },
  ],
  // 상고구역 5
  // upperFive: [{ id: "UFi1" }, { id: "UFi2" }, { id: "UFi3" }],

  // 가운데 1
  middleOne: [{ id: "MO1" }, { id: "MO2" }, { id: "MO3" }],
  // 가운데 2
  middleTwo: [
    { id: "MT1" },
    { id: "MT2" },
    { id: "MT3" },
    { id: "MT4" },
    { id: "MT5" },
    { id: "MT6" },
  ],
  // 가운데 3
  middleThree: [
    { id: "MTh1" },
    { id: "MTh2" },
    { id: "MTh3" },
    { id: "MTh4" },
    { id: "MTh5" },
    { id: "MTh6" },
  ],
  // 가운데 4
  middleFour: [{ id: "MF1" }, { id: "MF2" }, { id: "MF3" }],

  // 회의실 1
  meeting1: Array.from({ length: 10 }, (_, i) => ({
    id: `M1-${i + 1}`,
    label: "",
  })),
  // 회의실 2
  meeting2: Array.from({ length: 8 }, (_, i) => ({
    id: `M2-${i + 1}`,
    label: "",
  })),
  // room
  room: [
    { id: "R1" },
    { id: "R2" },
    { id: "R3" },
    { id: "R4" },
    { id: "R5" },
    { id: "R6" },
  ],
}; 