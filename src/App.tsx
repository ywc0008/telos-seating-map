import type { EmployeeInterface } from "./types/employee";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import Employee from "./components/Employee";
import WaitingSlot from "./components/WaitingSlot";
import Gogi from "./components/Gogi";

// Layout Components
import UpperSection from "./components/layout/UpperSection";
import MiddleSection from "./components/layout/MiddleSection";
import LowerSection from "./components/layout/LowerSection";

import { EmployeeData } from "./data/employeeData";

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

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="max-h-screen bg-gray-100 p-4">
        <h1 className="text-center text-3xl font-bold mb-4">
          텔로스 자리배치도
        </h1>

        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          {/* 상단 영역 */}
          <UpperSection
            people={people}
            onEmployeeDoubleClick={handleEmployeeDoubleClick}
          />

          {/* 중단 영역 */}
          <MiddleSection
            people={people}
            onEmployeeDoubleClick={handleEmployeeDoubleClick}
          />

          {/* 하단 영역 */}
          <LowerSection
            people={people}
            onEmployeeDoubleClick={handleEmployeeDoubleClick}
          />
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
            <Gogi id="gogi" name="고기" isPlaced={!!gogiPosition} />
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
                  <Gogi id="gogi" name="고기" isPlaced={!!gogiPosition} />
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
