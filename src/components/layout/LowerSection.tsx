import type { EmployeeInterface } from "@/types/employee";
import type { SeatType } from "@/data/seatsData";

import Seat from "@/components/Seat";
import Employee from "@/components/Employee";
import EmptySlot from "@/components/EmptySlot";
import { seats } from "@/data/seatsData";

interface LowerSectionProps {
  people: EmployeeInterface[];
  onEmployeeDoubleClick: (personId: string) => void;
}

export default function LowerSection({
  people,
  onEmployeeDoubleClick,
}: LowerSectionProps) {
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
    <div className="flex ">
      {/* 회의실 1 & 2 */}
      <div className=" col-span-2 row-start-3 flex gap-5">
        <div className="w-[600px] border-2 border-gray-300 p-5 bg-white rounded-lg">
          <h3 className="text-center font-semibold mb-5">회의실 1</h3>
        </div>

        <div className="w-[300px] border-2 border-gray-300 p-5 bg-white rounded-lg">
          <h3 className="text-center font-semibold mb-5">회의실 2</h3>
        </div>
      </div>

      {/* 방 */}
      <div className="col-start-3 row-start-3 flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2.5">
          {/* 1번 위치 */}
          <div key="room-pos-1">{renderSeat(seats.room[0])}</div>
          {/* 2번 위치 - 빈 공간 */}
          <div key="room-empty-2" className="min-w-[80px] min-h-[90px]"></div>
          {/* 3번 위치 */}
          <div key="room-pos-3">{renderSeat(seats.room[1])}</div>
          {/* 4번 위치 - 빈 공간 */}
          <div key="room-empty-4" className="min-w-[80px] min-h-[90px]"></div>
          {/* 5번 위치 - 빈 공간 */}
          <div key="room-empty-5" className="min-w-[80px] min-h-[90px]"></div>
          {/* 6번 위치 */}
          <div key="room-pos-6">{renderSeat(seats.room[2])}</div>
          {/* 7번 위치 */}
          <div key="room-pos-7">{renderSeat(seats.room[3])}</div>
          {/* 8번 위치 */}
          <div key="room-pos-8">{renderSeat(seats.room[4])}</div>
          {/* 9번 위치 */}
          <div key="room-pos-9">{renderSeat(seats.room[5])}</div>
        </div>
      </div>
    </div>
  );
}
