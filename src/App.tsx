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
import WaitingSlot from "./components/WaitingSlot";
import Gogi from "./components/Gogi";

import { EmployeeData } from "./data/employeeData";
import emergencyExitImg from "./assets/images/emergency-exit.png";

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

export default function App() {
  const [people, setPeople] = useState<EmployeeInterface[]>(EmployeeData);
  const [gogiPosition, setGogiPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
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
    if (active) {
      const activeId = active.id as string;

      // 고양이를 드래그하는 경우
      if (activeId === "gogi") {
        // 드래그 종료 시점의 위치를 사용
        const rect = active.rect.current.translated;
        if (rect) {
          setGogiPosition({
            x: rect.left,
            y: rect.top,
          });
        }
      } else if (over) {
        // 직원을 드래그하는 경우
        const activePersonId = activeId;
        const overSeatId = over.id as string;

        // 대기 영역으로 이동하는 경우
        if (overSeatId.startsWith("waiting-")) {
          movePerson(activePersonId, null);
        } else {
          // 이동하려는 좌석에 이미 다른 직원이 있는지 확인
          const personInTargetSeat = getPersonBySeat(overSeatId);

          if (personInTargetSeat) {
            // 자리 교체: 두 직원의 좌석을 서로 바꿈
            const activePerson = getPersonById(activePersonId);
            if (activePerson) {
              setPeople((prev) =>
                prev.map((p) => {
                  if (p.id === activePersonId) {
                    return { ...p, seat: overSeatId };
                  } else if (p.id === personInTargetSeat.id) {
                    return { ...p, seat: activePerson.seat };
                  }
                  return p;
                })
              );
            }
          } else {
            // 빈 좌석으로 이동
            movePerson(activePersonId, overSeatId);
          }
        }
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
      return <EmptySlot />;
    }

    const person = getPersonBySeat(seat.id);

    return (
      <Seat id={seat.id}>
        {person && (
          <Employee
            employeeData={person}
            onMiddleClick={() => handleEmployeeDoubleClick(person.id)}
          />
        )}
      </Seat>
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="max-h-screen bg-gray-100 p-4">
        <h1 className="text-center text-3xl font-bold mb-4">
          텔로스 자리배치도
        </h1>

        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          <div className="flex space-x-10">
            {/* 창고구역 */}
            <div className="border-2 border-gray-300 p-2.5 bg-white rounded-lg">
              <h3 className="text-center font-semibold text-nowrap">
                창고구역
              </h3>
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

            {/* <div className="grid grid-cols-1 gap-4">
              {seats.upperFive.map((seat) => (
                <div key={seat.id}>{renderSeat(seat)}</div>
              ))}
            </div> */}

            {/* 비상구 */}
            <div className="col-start-3 row-start-1 flex flex-col gap-2.5">
              <div className="flex flex-col bg-green-500 text-white p-5 text-center rounded-md [writing-mode:vertical-rl]">
                <img
                  src={emergencyExitImg}
                  alt="비상구"
                  className="size-8 h-auto"
                />
                <span>비상구</span>
              </div>
              {/* <div className="bg-gray-200 p-5 text-center rounded-md">
               스낵바
              </div> */}
            </div>
          </div>

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

          <div className="flex ">
            {/* 회의실 1 & 2 */}
            <div className=" col-span-2 row-start-3 flex gap-5">
              <div className="w-[600px] border-2 border-gray-300 p-5 bg-white rounded-lg">
                <h3 className="text-center font-semibold mb-5">회의실 1</h3>
                {/* <div className="grid grid-cols-5 gap-2.5">
                  {seats.meeting1.map((seat) => (
                    <UnableSeat key={seat.id} />
                  ))}
                </div> */}
              </div>

              <div className="w-[300px] border-2 border-gray-300 p-5 bg-white rounded-lg">
                <h3 className="text-center font-semibold mb-5">회의실 2</h3>
                {/* <div className="grid grid-cols-3 gap-2.5">
                  {seats.meeting2.map((seat) => (
                    <UnableSeat key={seat.id} />
                  ))}
                </div> */}
              </div>
            </div>

            {/* 방 */}
            <div className="col-start-3 row-start-3 flex flex-col gap-2.5">
              {/* <div className="bg-gray-200 p-5 text-center mb-2.5 rounded">
                책장
              </div> */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1번 위치 */}
                <div key="room-pos-1">{renderSeat(seats.room[0])}</div>
                {/* 2번 위치 - 빈 공간 */}
                <div
                  key="room-empty-2"
                  className="min-w-[80px] min-h-[90px]"
                ></div>
                {/* 3번 위치 */}
                <div key="room-pos-3">{renderSeat(seats.room[1])}</div>
                {/* 4번 위치 - 빈 공간 */}
                <div
                  key="room-empty-4"
                  className="min-w-[80px] min-h-[90px]"
                ></div>
                {/* 5번 위치 - 빈 공간 */}
                <div
                  key="room-empty-5"
                  className="min-w-[80px] min-h-[90px]"
                ></div>
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
        </div>

        {/* 고양이 - 절대 위치 */}
        {gogiPosition && (
          <div
            style={{
              position: "absolute",
              left: `${gogiPosition.x}px`,
              top: `${gogiPosition.y}px`,
              zIndex: 999,
            }}
          >
            <Gogi id="gogi" name="고기" />
          </div>
        )}

        {/* 배치 안한 직원 영역 - Floating Panel */}
        <div
          ref={panelRef}
          className="fixed border-2 border-orange-300 bg-orange-50 rounded-lg shadow-2xl"
          style={{
            left: `${panelPosition.x - 20}px`,
            top: `${panelPosition.y}px`,
            width: "300px",
            maxHeight: "80vh",
            zIndex: 1000,
          }}
        >
          <div
            className="bg-orange-300 p-3 rounded-t-md cursor-move select-none"
            onMouseDown={handlePanelMouseDown}
          >
            <h3 className="text-center font-semibold text-orange-800">
              배치 안한 직원 ({peopleWithoutSeat.length}명)
            </h3>
          </div>
          <div
            className="p-4 overflow-y-auto"
            style={{ maxHeight: "calc(80vh - 60px)" }}
          >
            <div className="grid grid-cols-2 gap-2.5">
              {/* 고양이가 처음에 여기에 표시 */}
              {!gogiPosition && (
                <div className="bg-orange-100 p-2 rounded-md border-2 border-orange-300 min-h-[90px] flex items-center justify-center">
                  <Gogi id="gogi" name="고기" />
                </div>
              )}
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

      <DragOverlay style={{ zIndex: 9999 }}>
        {activeId
          ? (() => {
              if (activeId === "gogi") {
                return <Gogi id="gogi" name="고기" />;
              }
              const person = getPersonById(activeId);
              return person ? <Employee employeeData={person} /> : null;
            })()
          : null}
      </DragOverlay>
    </DndContext>
  );
}
