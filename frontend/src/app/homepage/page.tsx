import Image from "next/image";

const events = [
  {
    id: 1,
    host: "chang_0607",
    date: "2024-10-10",
    startTime: "17:00:00",
    endTime: "19:00:00",
    description: "籃球(半場)",
    location: "河堤籃球場",
  },
  {
    id: 2,
    host: "shaw_0109",
    date: "2024-10-30",
    startTime: "14:00:00",
    endTime: "16:00:00",
    description: "網球",
    location: "四維網球場",
  },
  {
    id: 3,
    host: "JC_0628",
    date: "2024-10-21",
    startTime: "18:30:00",
    endTime: "21:00:00",
    description: "籃球(全場)",
    location: "體育館籃球場",
  },
  {
    id: 4,
    host: "mai_1228",
    date: "2024-10-19",
    startTime: "20:00:00",
    endTime: "22:00:00",
    description: "羽球",
    location: "萬興國小羽球場",
  },
  {
    id: 5,
    host: "wu_0905",
    date: "2024-10-27",
    startTime: "09:00:00",
    endTime: "12:00:00",
    description: "排球",
    location: "五期排球場",
  },
];

export default function Homepage() {
  return (
    <div>
      <h1 className="px-4">EVENT LIST</h1>
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
              <tr className="hover" key={event.id}>
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
    </div>
  );
}
