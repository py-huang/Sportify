"use client";
import { set } from "date-fns";
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

  interface JoinRecord {
    event: Event;
    join_user_id: string;
    join_event_id: number;
    join_time: string | null;
    leave_time: string | null;
    is_absence: boolean;
  }

  interface User {
    user_id: string;
    name: string;
    sex: string;
    age: number;
    is_nccu: boolean;
    introduce: string;
  }

  const [events, setEvents] = useState<JoinRecord[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<JoinRecord | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 呼叫後端 API 取得事件資料
    fetch("http://localhost:8000/api/join_events/chen_0307")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // 解析 JSON 格式的回應
      })
      .then((data) => {
        console.log("JOIN", data); // 顯示取得的資料
        setEvents(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

    fetch("http://localhost:8000/api/users/chen_0307")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // 解析 JSON 格式的回應
      })
      .then((data) => {
        console.log("user", data); // 顯示取得的資料
        setUser(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleRowClick = (event: JoinRecord) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div>
      <div className="font-bold text-xl flex flex-row items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        帳號資訊
      </div>

      <div className="my-4 p-4 flex flex-col bg-base-200 rounded-lg">
        <p className="py-2">使用者 ID：{user?.user_id}</p>
        <hr />
        <p className="py-2">姓名：{user?.name}</p>
        <hr />
        <p className="py-2">性別：{user?.sex}</p>
        <hr />
        <p className="py-2">年齡：{user?.age}</p>
        <hr />
        <p className="py-2">是否為政大學生：{user?.is_nccu ? "是" : "否"}</p>
        <hr />
        <p className="py-2">自我介紹：{user?.introduce}</p>
        <hr />
      </div>
      <div className="font-bold text-xl flex flex-row items-center gap-2">
        參與揪團紀錄
      </div>
      <div className="overflow-x-auto  mt-4 w-full">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>USERID</th>
              <th>DESCRIPTION</th>
              <th>DATE</th>
              <th>LOCATION</th>
              <th>JOIN TIME</th>
              <th>LEAVE TIME</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over events to generate rows */}
            {events.map((event) => (
              <tr
                className="hover cursor-pointer"
                key={event.join_event_id}
                onClick={() => handleRowClick(event)} // 使用處理函數
              >
                <th>{event.join_event_id}</th>
                <td>{event.join_user_id}</td>
                <td>{event.event.description}</td>
                <td>{event.event.date}</td>
                <td>{event.event.location}</td>
                <td>{event.join_time}</td>
                <td>{event.leave_time}</td>
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
              <p className="py-2">參加時間：{selectedEvent.join_time}</p>
              <hr />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
