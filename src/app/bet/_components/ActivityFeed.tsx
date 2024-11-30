import Image from "next/image";

export default function ActivityFeed() {
    const activities = [
        {
            id: 1,
            avatar: "https://utfs.io/f/fd125ff2-37e5-4c14-9b36-fbcaa3bacb6a-d6ph0f.35.56.png",
            username: "onder21",
            message: "has opened a bet with $20 on Team A!",
            timestamp: "2m ago",
        },
        {
            id: 2,
            avatar: "https://utfs.io/f/a871e06a-5b0d-422f-89a8-46e85f63f534-d6ph0f.41.42.png",
            username: "sabit",
            message: "joined the bet with $40 on Team B!",
            timestamp: "5m ago",
        },
        {
            id: 3,
            avatar: "https://utfs.io/f/e3cdfa5f-3272-4aeb-9a99-c4be0a181a7b-ayurua.png",
            username: "Fall",
            message: "won $400 from the bet on Team A! Congratulations!",
            timestamp: "10m ago",
        },
        {
            id: 4,
            avatar: "https://utfs.io/f/fd125ff2-37e5-4c14-9b36-fbcaa3bacb6a-d6ph0f.35.56.png",
            username: "onder21",
            message: "has opened a bet with $20 on Team A!",
            timestamp: "2m ago",
        },
        {
            id: 5,
            avatar: "https://utfs.io/f/a871e06a-5b0d-422f-89a8-46e85f63f534-d6ph0f.41.42.png",
            username: "sabit",
            message: "joined the bet with $40 on Team B!",
            timestamp: "5m ago",
        },
        {
            id: 6,
            avatar: "https://utfs.io/f/e3cdfa5f-3272-4aeb-9a99-c4be0a181a7b-ayurua.png",
            username: "Fall",
            message: "won $400 from the bet on Team A! Congratulations!",
            timestamp: "10m ago",
        },
    ];

    return (
        <div className="flex flex-col h-full overflow-y-scroll p-4 ">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex flex-row items-center shadow-sm rounded-lg p-3 mb-2 space-x-3"
                >
                    {/* Avatar */}
                    <Image
                        src={activity.avatar}
                        alt={activity.username}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                    />

                    {/* Message */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-300">
                            {activity.username}
                        </span>
                        <p className="text-sm text-gray-400">{activity.message}</p>
                    </div>

                    {/* Timestamp */}
                    <span className="ml-auto text-xs text-gray-500">{activity.timestamp}</span>
                </div>
            ))}
        </div>
    );
}
