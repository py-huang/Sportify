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

  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    // 呼叫後端 API 取得事件資料
    fetch("http://localhost:8000/api/events?host_id=chen_0307")
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

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    fetch(`http://localhost:8000/api/events/${selectedEvent.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete event");
        }
        console.log("Event deleted successfully");
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        ); // 更新前端事件列表
        setSelectedEvent(null); // 關閉模態框
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };
  const handleUpdateEvent = () => {
    if (!selectedEvent) return;

    const updatedEvent = {
      ...selectedEvent,
      host: selectedEvent.host, // Check if this should be updated or not
      description: event || selectedEvent.description, // Make sure the event state is being updated
      date: date || selectedEvent.date,
      startTime: startTime || selectedEvent.startTime,
      endTime: endTime || selectedEvent.endTime,
      location: location || selectedEvent.location,
    };

    fetch(`http://localhost:8000/api/events/${selectedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update event");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Event updated successfully:", data);
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id ? data : event
          )
        );
        setSelectedEvent(null); // Close the modal
        fetch("http://localhost:8000/api/events?host_id=chen_0307")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Parse the updated event list
          })
          .then((updatedData) => {
            setEvents(updatedData); // Update the event list with the new data
            setSelectedEvent(null); // Close the modal
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  return (
    <div className="p-4 w-full">
      <h1 className="px-4">你的揪團活動</h1>
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
                key={event.id}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 h-full">
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
              <div className="flex flex-row items-center gap-4 py-2">
                <p className="py-2 flex flex-shrink-0">揪團活動：</p>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={event || selectedEvent?.description || ""}
                  onChange={(e) => setEvent(e.target.value)}
                >
                  <option value="" disabled>
                    揪團內容
                  </option>
                  <option value="籃球(全場)">籃球(全場)</option>
                  <option value="籃球(半場)">籃球(半場)</option>
                  <option value="羽球">羽球</option>
                  <option value="桌球">桌球</option>
                  <option value="網球">網球</option>
                  <option value="排球">排球</option>
                  <option value="足球">足球</option>
                </select>
              </div>
              <hr />
              <div className="flex flex-row items-center gap-4 py-2">
                <p className="py-2">日期：</p>
                <div className="relative max-w-sm cursor-pointer">
                  <div className="cursor-pointer absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="cursor-pointer w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </div>
                  <input
                    id="datepicker-actions"
                    type="date"
                    className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Select date"
                    value={date || selectedEvent?.date || ""}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <hr />
              <div className="flex flex-row items-center gap-4 py-2">
                <p className="py-2">時間：</p>
                <div className="relative max-w-sm cursor-pointer flex flex-row gap-4 items-center">
                  <input
                    type="time"
                    id="time"
                    className="cursor-pointer rounded-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    min="09:00"
                    max="22:00"
                    value={startTime || selectedEvent?.startTime || ""}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                  -
                  <input
                    type="time"
                    id="time"
                    className="cursor-pointer rounded-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    min="09:00"
                    max="22:00"
                    value={endTime || selectedEvent?.endTime || ""}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <hr />
              <div className="flex flex-row items-center gap-4 py-2">
                <p className="py-2 flex flex-shrink-0">揪團地點：</p>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={location || selectedEvent?.location || ""}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="" disabled>
                    揪團場地
                  </option>
                  <option value="河堤籃球場">河堤籃球場</option>
                  <option value="河堤棒球場">河堤棒球場</option>
                  <option value="四維網球場">四維網球場</option>
                  <option value="體育館桌球室">體育館桌球室</option>
                  <option value="萬興國小羽球場">萬興國小羽球場</option>
                  <option value="體育館籃球場">體育館籃球場</option>
                  <option value="五期排球場">五期排球場</option>
                </select>
              </div>
              <hr />
            </div>
            <div className="flex flex-row justify-between">
              <button
                className="btn btn-error min-w-[150px] text-lg flex-shrink-0"
                onClick={handleDeleteEvent}
              >
                刪除揪團
              </button>
              <button
                className="btn btn-info min-w-[150px] text-lg flex-shrink-0"
                onClick={handleUpdateEvent}
              >
                修改揪團資訊
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
