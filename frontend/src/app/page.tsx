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

  interface Discussion {
    comment_id: number;
    user_id: string;
    comment: string;
    comment_time: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);

    fetch(`http://localhost:8000/api/events/${event.id}/discussions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDiscussions(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setDiscussions([]);
    setNewComment("");
  };

  const handleSignup = () => {
    if (!selectedEvent) return;

    const userId = "chen_0307";

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
        setSelectedEvent(null);
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  };

  const handleAddComment = () => {
    if (!selectedEvent || !newComment.trim()) return;

    const userId = "chen_0307";

    fetch("http://localhost:8000/api/events/discussions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        event_id: selectedEvent.id,
        comment: newComment,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDiscussions((prev) => [...prev, data]);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="px-4">所有揪團資訊</h1>
      <div className="overflow-x-auto">
        <table className="table">
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
            {events.map((event) => (
              <tr
                className="hover cursor-pointer"
                key={event.id}
                onClick={() => handleRowClick(event)}
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

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-box relative w-full bg-white p-8 rounded-lg shadow-lg">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
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

            <h3 className="font-bold text-lg mt-6">留言討論</h3>
            <div className="my-4 p-4 flex flex-col bg-base-200 rounded-lg max-h-64 overflow-y-auto">
              {discussions.length > 0 ? (
                discussions.map((discussion) => (
                  <div key={discussion.comment_id} className="mb-4">
                    <p className="font-semibold">{discussion.user_id}</p>
                    <p className="text-sm text-gray-500">{discussion.comment_time}</p>
                    <p className="mt-2">{discussion.comment}</p>
                    <hr className="my-2" />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">目前尚無留言。</p>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="btn btn-warning min-w-[150px] text-lg"
                onClick={handleSignup}
              >
                加入揪團
              </button>
              <div className="flex flex-col items-end">
                <textarea
                  className="textarea textarea-bordered w-full mb-2"
                  placeholder="新增留言..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="btn btn-primary w-full"
                  onClick={handleAddComment}
                >
                  提交留言
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}