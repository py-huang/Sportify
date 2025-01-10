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

  const cancelSignup = () => {
    if (!selectedEvent) return;

    fetch("http://localhost:8000/api/cancel_signup_event", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "chen_0307",
        eventId: selectedEvent.event.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Signup canceled:", data);

        // Remove the canceled event from the list
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.sign_id !== selectedEvent.sign_id)
        );

        // Close the modal
        closeModal();
      })
      .catch((error) => {
        console.error("There was an error canceling the signup:", error);
      });
  };

  return (
    <div>
      <div className="font-bold text-xl flex flex-row items-center gap-2">
        <svg
          className="h-5 w-5 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
          />
        </svg>
        我的報名資訊
      </div>
      <div className="overflow-x-auto  mt-4">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>HOST</th>
              <th>DESCRIPTION</th>
              <th>DATE</th>
              <th>START TIME</th>
              <th>END TIME</th>
              <th>LOCATION</th>
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
                <td>{event.event.description}</td>
                <td>{event.event.date}</td>
                <td>{event.event.startTime}</td>
                <td>{event.event.endTime}</td>
                <td>{event.event.location}</td>
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
              <p className="py-2">報名時間：{selectedEvent.sign_time}</p>
              <hr />
            </div>
            <button
              onClick={cancelSignup}
              className="btn btn-error  min-w-[150px] text-lg flex-shrink-0"
            >
              取消揪團
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
