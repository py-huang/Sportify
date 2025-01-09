"use client";
import { useEffect, useState } from "react";

export default function Homepage() {
  interface Event {
    event: {
      id: number;
      host: string;
      date: string;
      startTime: string;
      endTime: string;
      description: string;
      location: string;
    };
    sign_id: number;
    sign_user: string;
    sign_time: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // 呼叫後端 API 取得事件資料
    fetch("http://localhost:8000/api/signup_events/chen_0307")
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

  return (
    <div>
      <h1 className="px-4">我的報名資訊</h1>
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
              <th>SIGN UP TIME</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over events to generate rows */}
            {events.map((event) => (
              <tr
                className="hover cursor-pointer"
                key={event.event.id}
                onClick={() => handleRowClick(event)} // 使用處理函數
              >
                <th>{event.event.id}</th>
                <td>{event.event.host}</td>
                <td>{event.event.date}</td>
                <td>{event.event.startTime}</td>
                <td>{event.event.endTime}</td>
                <td>{event.event.location}</td>
                <td>{event.event.description}</td>
                <td>{event.sign_time}</td>
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
              <p className="py-2">團長：{selectedEvent.event.host}</p>
              <hr />
              <p className="py-2">
                揪團活動：{selectedEvent.event.description}
              </p>
              <hr />
              <p className="py-2">日期：{selectedEvent.event.date}</p>
              <hr />
              <p className="py-2">
                時間：{selectedEvent.event.startTime} -{" "}
                {selectedEvent.event.endTime}
              </p>
              <hr />
              <p className="py-2">地點：{selectedEvent.event.location}</p>
              <hr />
            </div>
            <button className="btn btn-error  min-w-[150px] text-lg flex-shrink-0">
              取消揪團
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
