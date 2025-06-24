import type { EmployeeInterface } from "@/types/employee";
import type { SeatType } from "@/data/seatsData";

import Seat from "@/components/Seat";
import Employee from "@/components/Employee";
import EmptySlot from "@/components/EmptySlot";
import emergencyExitImg from "@/assets/images/emergency-exit.png";
import { seats } from "@/data/seatsData";

interface UpperSectionProps {
  people: EmployeeInterface[];
  onEmployeeDoubleClick: (personId: string) => void;
}

export default function UpperSection({
  people,
  onEmployeeDoubleClick,
}: UpperSectionProps) {
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
    <div className="flex space-x-10">
      {/* 창고구역 */}
      <div className="border-2 border-gray-300 p-2.5 bg-white rounded-lg">
        <h3 className="text-center font-semibold text-nowrap">창고구역</h3>
      </div>

      {/* 상단 영역 */}
      <div className="grid grid-cols-2 gap-4">
        {seats.upperOne.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      <div className="w-4 bg-black self-stretch" />

      <div className="grid grid-cols-2 gap-4">
        {seats.upperTwo.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      <div className="w-4 bg-black self-stretch" />

      <div className="grid grid-cols-2 gap-4">
        {seats.upperThree.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      <div className="w-4 bg-black self-stretch" />

      <div className="grid grid-cols-2 gap-4">
        {seats.upperFour.map((seat) => (
          <div key={seat.id}>{renderSeat(seat)}</div>
        ))}
      </div>

      {/* 비상구 */}
      <div className="col-start-3 row-start-1 flex flex-col gap-2.5">
        <div className="flex flex-col bg-green-500 text-white p-5 text-center rounded-md [writing-mode:vertical-rl]">
          <img src={emergencyExitImg} alt="비상구" className="size-8 h-auto" />
          <span>비상구</span>
        </div>
      </div>
    </div>
  );
}
