import type { EmployeeInterface } from "./types/employee";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import Seat from "./components/Seat";
import Employee from "./components/Employee";
import EmptySlot from "./components/EmptySlot";
import UnableSeat from "./components/UnableSeat";
import WaitingSlot from "./components/WaitingSlot";

import "./App.css";
import { EmployeeData } from "./data/employeeData";

// 좌석 타입 정의
interface SeatType {
  id: string;
  label?: string;
  empty?: boolean;
}

// 좌석 데이터 - 실제 배치도와 동일하게 구성
const seats = {
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
  upperFour: [{ id: "UF1" }, { id: "UF2" }, { id: "UF3" }],
  // 상고구역 5
  upperFive: [{ id: "UFi1" }, { id: "UFi2" }, { id: "UFi3" }],

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



export default function App() {
  const [people, setPeople] = useState<EmployeeInterface[]>(EmployeeData);
  const [panelPosition, setPanelPosition] = useState({
    x: window.innerWidth - 300,
    y: 100,
  });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const getPersonBySeat = (seatId: string) =>
    people.find((p) => p.seat === seatId);

  const getPersonById = (personId: string) =>
    people.find((p) => p.id === personId);

  // seat 값이 없는 직원들 필터링
  const peopleWithoutSeat = people.filter((p) => !p.seat);

  // 대기 슬롯 생성 (최소 10개, 대기 직원 수보다 2개 더 많게)
  const waitingSlotCount = Math.max(10, peopleWithoutSeat.length + 2);
  const waitingSlots = Array.from(
    { length: waitingSlotCount },
    (_, i) => `waiting-${i + 1}`
  );

  function movePerson(personId: string, toSeatId: string | null) {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, seat: toSeatId || undefined } : p
      )
    );
  }

  function handleEmployeeDoubleClick(personId: string) {
    movePerson(personId, null);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (over && active) {
      // 배치 안한 직원 영역으로 이동하는 경우
      if (over.id.toString().startsWith("waiting-")) {
        movePerson(active.id as string, null);
      } else {
        movePerson(active.id as string, over.id as string);
      }
    }
    setActiveId(null);
  }

  // 패널 드래그 시작
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsDraggingPanel(true);
    }
  };

  // 패널 드래그 중
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPanel) {
        setPanelPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPanel(false);
    };

    if (isDraggingPanel) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingPanel]);

  // 좌석 렌더링 헬퍼 함수
  const renderSeat = (seat: SeatType) => {
    if (seat.empty) {
      return <EmptySlot key={seat.id} />;
    }

    return (
      <Seat key={seat.id} id={seat.id}>
        {(() => {
          const person = getPersonBySeat(seat.id);
          return person ? (
            <Employee
              employeeData={person}
              onMiddleClick={() => handleEmployeeDoubleClick(person.id)}
            />
          ) : null;
        })()}
      </Seat>
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-100 p-5">
        <h1 className="text-center text-3xl font-bold mb-8">
          텔로스 자리배치도
        </h1>

        <div className="flex flex-col gap-5 max-w-7xl mx-auto">
          <div className="flex space-x-10">
            {/* 창고구역 */}
            <div className="border-2 border-gray-300 p-2.5 bg-white rounded-lg">
              <h3 className="text-center font-semibold text-nowrap">창고구역</h3>
            </div>

            {/* 상단 영역 */}
            <div className="grid grid-cols-2 gap-10">
              {seats.upperOne.map((seat) => renderSeat(seat))}
            </div>

            <div className="w-4 bg-black self-stretch" />

            <div className="grid grid-cols-2 gap-10">
              {seats.upperTwo.map((seat) => renderSeat(seat))}
            </div>

            <div className="w-4 bg-black self-stretch" />

            <div className="grid grid-cols-2 gap-10">
              {seats.upperThree.map((seat) => renderSeat(seat))}
            </div>

            <div className="w-4 bg-black self-stretch" />

            <div className="grid grid-cols-1 gap-10">
              {seats.upperFour.map((seat) => renderSeat(seat))}
            </div>

            <div className="w-4 bg-black self-stretch" />

            <div className="grid grid-cols-1 gap-10">
              {seats.upperFive.map((seat) => renderSeat(seat))}
            </div>

            {/* 비상구 */}
            <div className="col-start-3 row-start-1 flex flex-col gap-2.5">
              <div className="bg-green-500 text-white p-5 text-center rounded-md">
                비상구
              </div>
              <div className="bg-gray-200 p-5 text-center rounded-md">
               스낵바
              </div>
            </div>
          </div>

          <div className="flex">
            {/* 휴게공간 */}
            <div className="col-start-1 row-start-2 border-2 border-gray-300 p-2.5 bg-white rounded-lg">
              <h3 className="text-center font-semibold mb-2.5">휴게공간</h3>
              <div className="bg-gray-200 h-24 flex items-center justify-center rounded">
                책장
              </div>
            </div>

            {/* 중앙 좌석들 */}
            <div className="col-start-2 row-start-2 grid grid-cols-4 gap-2.5">
              {seats.middleOne.map((seat) => renderSeat(seat))}
            </div>

            <div className="col-start-2 row-start-2 grid grid-cols-3 gap-2.5 mt-5">
              {seats.middleTwo.map((seat) => renderSeat(seat))}
            </div>

            <div className="col-start-2 row-start-2 grid grid-cols-5 gap-2.5 mt-5">
              {seats.middleThree.map((seat) => renderSeat(seat))}
            </div>

            <div className="col-start-2 row-start-2 grid grid-cols-3 gap-2.5 mt-5">
              {seats.middleFour.map((seat) => renderSeat(seat))}
            </div>

            {/* 탕비실 & 싱크대 */}
            <div className="col-start-3 row-start-2 flex flex-col gap-2.5">
              <div className="bg-blue-500 text-white p-5 text-center rounded-md">
                탕비실
              </div>
              <div className="bg-blue-400 text-white p-5 text-center rounded-md">
                싱크대
              </div>
            </div>
          </div>
          <div className="flex">
            {/* 회의실 1 & 2 */}
            <div className="col-span-2 row-start-3 flex gap-5">
              <div className="flex-1 border-2 border-gray-300 p-5 bg-white rounded-lg">
                <h3 className="text-center font-semibold mb-5">회의실 1</h3>
                <div className="grid grid-cols-5 gap-2.5">
                  {seats.meeting1.map((seat) => (
                    <UnableSeat key={seat.id} />
                  ))}
                </div>
              </div>

              <div className="w-[300px] border-2 border-gray-300 p-5 bg-white rounded-lg">
                <h3 className="text-center font-semibold mb-5">회의실 2</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {seats.meeting2.map((seat) => (
                    <UnableSeat key={seat.id} />
                  ))}
                </div>
              </div>
            </div>

            {/* 방 */}
            <div className="col-start-3 row-start-3 flex flex-col gap-2.5">
              <div className="bg-gray-200 p-5 text-center mb-2.5 rounded">
                책장
              </div>
              {seats.room.map((seat) => renderSeat(seat))}
            </div>
          </div>
        </div>

        {/* 배치 안한 직원 영역 - Floating Panel */}
        <div
          ref={panelRef}
          className="fixed border-2 border-orange-300 bg-orange-50 rounded-lg shadow-2xl"
          style={{
            left: `${panelPosition.x}px`,
            top: `${panelPosition.y}px`,
            width: "280px",
            maxHeight: "600px",
            zIndex: 1000,
          }}
        >
          <div
            className="bg-orange-300 p-3 rounded-t-md cursor-move select-none"
            onMouseDown={handlePanelMouseDown}
          >
            <h3 className="text-center font-semibold text-orange-800">
              배치 안한 직원
            </h3>
          </div>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: "550px" }}>
            <div className="grid grid-cols-2 gap-2.5">
              {waitingSlots.map((slotId) => {
                const person = peopleWithoutSeat.find(
                  (_, index) => `waiting-${index + 1}` === slotId
                );
                return (
                  <WaitingSlot key={slotId} id={slotId}>
                    {person && <Employee employeeData={person} />}
                  </WaitingSlot>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId
          ? (() => {
              const person = getPersonById(activeId);
              return person ? <Employee employeeData={person} /> : null;
            })()
          : null}
      </DragOverlay>
    </DndContext>
  );
}
