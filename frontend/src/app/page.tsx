"use client";
import { useEffect, useState } from "react";

export default function Homepage() {
  interface Event {
    id: number;
    host: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    location: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // 呼叫後端 API 取得事件資料
    fetch("http://localhost:8000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // 解析 JSON 格式的回應
      })
      .then((data) => {
        console.log(data); // 顯示取得的資料
        setEvents(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleSignup = () => {
    if (!selectedEvent) return;

    const userId = "chen_0307"; // 您需要用實際的用戶 ID 替換此部分

    fetch("http://localhost:8000/api/signup_events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        eventId: selectedEvent.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Signup successful:", data);
        // 可以在這裡顯示提示，或更新 UI 以顯示已報名
        setSelectedEvent(null); // 重新關閉模態框
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="px-4">所有揪團資訊</h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>HOST</th>
              <th>DATE</th>
              <th>START TIME</th>
              <th>END TIME</th>
              <th>LOCATION</th>
              <th>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over events to generate rows */}
            {events.map((event) => (
              <tr
                className="hover cursor-pointer"
                key={`${event.id}-${event.date}`}
                onClick={() => handleRowClick(event)} // 使用處理函數
              >
                <th>{event.id}</th>
                <td>{event.host}</td>
                <td>{event.date}</td>
                <td>{event.startTime}</td>
                <td>{event.endTime}</td>
                <td>{event.location}</td>
                <td>{event.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-box relative w-full bg-white p-8 rounded-lg shadow-lg">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={closeModal}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">揪團資訊</h3>
            <div className="my-4 p-4 flex flex-col bg-base-200 rounded-lg">
              <p className="py-2">團長：{selectedEvent.host}</p>
              <hr />
              <p className="py-2">揪團活動：{selectedEvent.description}</p>
              <hr />
              <p className="py-2">日期：{selectedEvent.date}</p>
              <hr />
              <p className="py-2">
                時間：{selectedEvent.startTime} - {selectedEvent.endTime}
              </p>
              <hr />
              <p className="py-2">地點：{selectedEvent.location}</p>
              <hr />
            </div>
            <button
              className="btn btn-warning min-w-[150px] text-lg flex-shrink-0"
              onClick={handleSignup}
            >
              加入揪團
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
