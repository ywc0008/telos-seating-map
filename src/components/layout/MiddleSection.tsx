import type { EmployeeInterface } from "@/types/employee";
import type { SeatType } from "@/data/seatsData";

import Seat from "@/components/Seat";
import Employee from "@/components/Employee";
import EmptySlot from "@/components/EmptySlot";
import { seats } from "@/data/seatsData";

interface MiddleSectionProps {
  people: EmployeeInterface[];
  onEmployeeDoubleClick: (personId: string) => void;
}

export default function MiddleSection({
  people,
  onEmployeeDoubleClick,
}: MiddleSectionProps) {
  const getPersonBySeat = (seatId: string) =>
    people.find((p) => p.seat === seatId);

  const renderSeat = (seat: SeatType) => {
    if (seat.empty) {
      return <EmptySlot />;
    }

    const person = getPersonBySeat(seat.id);

    return (
      <Seat id={seat.id}>
        {person && (
          <Employee
            employeeData={person}
            onMiddleClick={() => onEmployeeDoubleClick(person.id)}
          />
        )}
      </Seat>
    );
  };

  return (
    <div className="flex space-x-10 ml-[120px]">
      {/* 휴게공간 & 책장 */}
      <div className="flex">
        <div className="w-24 border-2 border-gray-300 p-2.5 bg-white rounded-lg">
          <h3 className="text-center font-semibold">휴게공간</h3>
        </div>
        <div className="w-13 border-2 border-gray-300 p-2.5 bg-gray-200 rounded-lg">
          <h3 className="text-center font-semibold">책장</h3>
        </div>
      </div>

      {/* 중앙 좌석들 */}
      <div className="grid grid-cols-1 gap-4">
        {seats.middleOne.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      <div className="w-4 bg-black self-stretch" />

      <div className="grid grid-cols-2 gap-4">
        {seats.middleTwo.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      <div className="w-4 bg-black self-stretch" />

      <div className="grid grid-cols-2 gap-4">
        {seats.middleThree.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      <div className="w-4 bg-black self-stretch" />

      <div className="grid grid-cols-1 gap-4">
        {seats.middleFour.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      {/* 탕비실 */}
      <div className="self-stretch">
        <div className="max-h-[270px] h-full bg-blue-500 text-white p-5 text-center rounded-md [writing-mode:vertical-rl]">
          탕비실
        </div>
      </div>
    </div>
  );
}
