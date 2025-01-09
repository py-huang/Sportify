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
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [event, setEvent] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      // 發送 POST 請求到 API
      console.log(date, startTime, endTime, event, location);
      const response = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date,
          startTime: startTime.length === 5 ? `${startTime}:00` : startTime,
          endTime: endTime.length === 5 ? `${endTime}:00` : endTime,
          description: event,
          location: location,
          host: "chen_0307",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("活動新增成功！");
      } else {
        setMessage(`新增失敗：${data.message}`);
      }
    } catch (error) {
      setMessage(`錯誤：${(error as any).message}`);
    }
  };

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="px-4">新增一筆揪團</h1>
        <button onClick={handleSubmit} className="btn ">
          新增一筆揪團
        </button>
      </div>
      <div className="overflow-x-auto px-4">
        <label className="form-control w-full max-w-xs py-2">
          <div className="label">
            <span className="label-text">揪團內容</span>
          </div>
          <select
            className="select select-bordered w-full max-w-xs"
            value={event}
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
        </label>
        <label className="form-control w-full max-w-xs py-2">
          <div className="label">
            <span className="label-text">揪團場地</span>
          </div>
          <select
            className="select select-bordered w-full max-w-xs"
            value={location}
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
        </label>
        <label className="form-control w-full max-w-xs py-2">
          <div className="label">
            <span className="label-text">揪團日期</span>
          </div>

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
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </label>
        <div className="flex flex-row gap-4">
          <label className="form-control w-full max-w-xs py-2">
            <div className="label">
              <span className="label-text">揪團開始時間</span>
            </div>

            <input
              type="time"
              id="time"
              className="cursor-pointer rounded-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="09:00"
              max="22:00"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label className="form-control w-full max-w-xs py-2">
            <div className="label">
              <span className="label-text">揪團結束時間</span>
            </div>
            <input
              type="time"
              id="time"
              className="cursor-pointer rounded-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="09:00"
              max="22:00"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>{" "}
        </div>
      </div>
    </div>
  );
}
