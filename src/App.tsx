import type { EmployeeInterface } from './types/employee';

import { useState, useRef, useEffect } from 'react';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';

import Seat from './components/Seat';
import Employee from './components/Employee';
import UnableSeat from './components/UnableSeat';
import WaitingSlot from './components/WaitingSlot';

import './App.css';

// 좌석 데이터 - 실제 배치도와 동일하게 구성
const seats = {
  // 상고구역 (왼쪽 상단)
  upperLeft: [
    { id: 'UL1', },
    { id: 'UL2',  },
    { id: 'UL3',  },
    { id: 'UL4', },
  ],
  // 상고구역 오른쪽
  upperRight: [
    { id: 'UR1', },
    { id: 'UR2', },
    { id: 'UR3', },
    { id: 'UR4', },
    { id: 'UR5', },
    { id: 'UR6', },
  ],
  // 휴게공간 주변
  lounge: [
    { id: 'L1', },
    { id: 'L2', },
    { id: 'L3', },
    { id: 'L4', },
    { id: 'L5', },
    { id: 'L6', },
    { id: 'L7', },
    { id: 'L8', },
  ],
  // 회의실 1 앞
  meeting1: Array.from({ length: 10 }, (_, i) => ({ id: `M1-${i + 1}`, label: '' })),
  // 회의실 2 앞
  meeting2: Array.from({ length: 6 }, (_, i) => ({ id: `M2-${i + 1}`, label: '' })),
  // 책장 오른쪽
  rightSide: [
    { id: 'R1',  },
    { id: 'R2', },
    { id: 'R3',  },
    { id: 'R4',  },
    { id: 'R5',  },
    { id: 'R6',  },
  ],
};

// 초기 직원 데이터
const initialPeople: EmployeeInterface[] = [
  // 전략경영팀
  { id: 'p1', name: '한소리', position: '과장', department: '전략경영팀', gender: 'female' as const, seat: 'UL1' },
  { id: 'p2', name: '권이경', position: '대리', department: '전략경영팀', gender: 'female' as const, seat: 'UL2' },
  { id: 'p3', name: '황큰별', position: '대표이사', department: '전략경영팀', gender: 'male' as const, seat: 'UL3' },
  { id: 'p4', name: '양세리', position: '수습', department: '전략경영팀', gender: 'female' as const, seat: 'UL4' },
  { id: 'p5', name: '임동준', position: '실장', department: '전략경영팀', gender: 'male' as const }, 
  // 디자인팀
  { id: 'p6', name: '김경진', position: '과장', department: '디자인팀', gender: 'female' as const}, 
  { id: 'p7', name: '정영하', position: '주임', department: '디자인팀', gender: 'female' as const}, 
  // 마케팅팀
  { id: 'p8', name: '최인서', position: '대리', department: '마케팅팀', gender: 'male' as const}, 
  // 그래픽팀
  { id: 'p9', name: '오병권', position: '대리', department: '그래픽팀', gender: 'male' as const}, 
  { id: 'p10', name: '김가효', position: '사원', department: '그래픽팀', gender: 'female' as const}, 
  { id: 'p11', name: '박범수', position: '사원', department: '그래픽팀', gender: 'male' as const}, 
  { id: 'p12', name: '김서연', position: '주임', department: '그래픽팀', gender: 'female' as const}, 
  { id: 'p13', name: '김정규', position: '주임', department: '그래픽팀', gender: 'male' as const}, 
  { id: 'p14', name: '정은총', position: '주임', department: '그래픽팀', gender: 'female' as const}, 
  // 메타개발팀
  { id: 'p15', name: '김상백', position: '대리', department: '메타개발팀', gender: 'male' as const, seat: 'L1' },
  { id: 'p16', name: '하준혁', position: '사원', department: '메타개발팀', gender: 'male' as const, seat: 'L2' },
  { id: 'p17', name: '김진형', position: '주임', department: '메타개발팀', gender: 'male' as const, seat: 'L3' },
  { id: 'p18', name: '툽신톨가', position: '주임', department: '메타개발팀', gender: 'male' as const, seat: 'L4' },
  // R&D팀
  { id: 'p19', name: '유주성', position: '과장', department: 'R&D팀', gender: 'male' as const, seat: 'UR1' },
  { id: 'p20', name: '이민지', position: '대리', department: 'R&D팀', gender: 'female' as const, seat: 'UR2' },
  { id: 'p21', name: '정별', position: '대리', department: 'R&D팀', gender: 'female' as const, seat: 'UR3' },
  { id: 'p21', name: '김예지', position: '수습', department: 'R&D팀', gender: 'female' as const, seat: 'UR4' },
  { id: 'p21', name: '송주환', position: '주임', department: 'R&D팀', gender: 'male' as const, seat: 'UR5' },
  // 서비스팀
  { id: 'p22', name: '이용주', position: '대리', department: '서비스팀', gender: 'male' as const, seat: 'L1' },
  { id: 'p23', name: '이우창', position: '사원', department: '서비스팀', gender: 'male' as const, seat: 'L2' },
  { id: 'p24', name: '육장훈', position: '수습', department: '서비스팀', gender: 'male' as const, seat: 'L3' },
  { id: 'p25', name: '김찬규', position: '주임', department: '서비스팀', gender: 'male' as const, seat: 'L4' },
  { id: 'p26', name: '양지훈', position: '주임', department: '서비스팀', gender: 'male' as const, },
  { id: 'p27', name: '이진규', position: '주임', department: '서비스팀', gender: 'male' as const, },
  { id: 'p28', name: '코디르벡', position: '주임', department: '서비스팀', gender: 'male' as const, },
  // 메타기획팀
  { id: 'p29', name: '김원민', position: '주임', department: '메타기획팀', gender: 'male' as const, },
  // 전북영업본부
  { id: 'p30', name: '유정주', position: '본부장', department: '전북영업본부', gender: 'male' as const, },
];

export default function App() {
  const [people, setPeople] = useState<EmployeeInterface[]>(initialPeople);
  const [panelPosition, setPanelPosition] = useState({ x: window.innerWidth - 300, y: 100 });
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
  const waitingSlots = Array.from({ length: waitingSlotCount }, (_, i) => `waiting-${i + 1}`);

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
      if (over.id.toString().startsWith('waiting-')) {
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
        y: e.clientY - rect.top
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
          y: e.clientY - dragOffset.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPanel(false);
    };

    if (isDraggingPanel) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPanel]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-100 p-5">
        <h1 className="text-center text-3xl font-bold mb-8">
          텔로스 자리배치도
        </h1>
        
        <div className="grid grid-cols-[200px_1fr_200px] grid-rows-[auto_auto_1fr] gap-5 max-w-7xl mx-auto">
          {/* 창고구역 */}
          <div className="col-start-1 row-start-1 border-2 border-gray-300 p-2.5 bg-white rounded-lg">
            <h3 className="text-center font-semibold mb-2.5">창고구역</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {seats.upperLeft.map((seat) => (
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
              ))}
            </div>
          </div>

          {/* 상단 영역 */}
          <div className="col-start-2 row-start-1 grid grid-cols-3 gap-2.5">
            {seats.upperRight.map((seat) => (
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
            ))}
          </div>

          {/* 비상구 */}
          <div className="col-start-3 row-start-1 flex flex-col gap-2.5">
            <div className="bg-green-500 text-white p-5 text-center rounded-md">
              비상구
            </div>
            <div className="bg-gray-200 p-5 text-center rounded-md">
              소냉바
            </div>
          </div>

          {/* 휴게공간 */}
          <div className="col-start-1 row-start-2 border-2 border-gray-300 p-2.5 bg-white rounded-lg">
            <h3 className="text-center font-semibold mb-2.5">휴게공간</h3>
            <div className="bg-gray-200 h-24 flex items-center justify-center rounded">
              책장
            </div>
          </div>

          {/* 중앙 좌석들 */}
          <div className="col-start-2 row-start-2 grid grid-cols-4 gap-2.5">
            {seats.lounge.map((seat) => (
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
            ))}
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

          {/* 오른쪽 책장 & 좌석 */}
          <div className="col-start-3 row-start-3 flex flex-col gap-2.5">
            <div className="bg-gray-200 p-5 text-center mb-2.5 rounded">
              책장
            </div>
            {seats.rightSide.map((seat) => (
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
            ))}
          </div>
        </div>

        {/* 배치 안한 직원 영역 - Floating Panel */}
        <div
          ref={panelRef}
          className="fixed border-2 border-orange-300 bg-orange-50 rounded-lg shadow-2xl"
          style={{
            left: `${panelPosition.x}px`,
            top: `${panelPosition.y}px`,
            width: '280px',
            maxHeight: '600px',
            zIndex: 1000
          }}
        >
          <div
            className="bg-orange-300 p-3 rounded-t-md cursor-move select-none"
            onMouseDown={handlePanelMouseDown}
          >
            <h3 className="text-center font-semibold text-orange-800">배치 안한 직원</h3>
          </div>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: '550px' }}>
            <div className="grid grid-cols-2 gap-2.5">
              {waitingSlots.map((slotId) => {
                const person = peopleWithoutSeat.find((_, index) => `waiting-${index + 1}` === slotId);
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
        {activeId ? (
          (() => {
            const person = getPersonById(activeId);
            return person ? <Employee employeeData={person} /> : null;
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}


