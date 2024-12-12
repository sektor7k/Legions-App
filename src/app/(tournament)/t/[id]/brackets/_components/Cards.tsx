import Image from "next/image";
interface TCardProps {
    team?: {
        teamId?: {
            teamName?: string;
            teamImage?: string;
        }
        score?: number;
        _id: string
    };
}

export default function TCard({ team,  }: TCardProps) {

    const isTeamNull = !team?.teamId;

    return (
        <div className="h-16 w-32 bg-red-800 bg-opacity-50 border-2 border-red-800 backdrop-blur-sm rounded-sm relative with-connector grid grid-cols-3">          
            <div className="col-span-2 flex flex-col items-center justify-center">
                <Image
                    src={team?.teamId?.teamImage || "/defaultteam.png"}
                    alt={team?.teamId?.teamImage || "No Team"}
                    width={100}
                    height={100}
                    className={` h-10 w-10 rounded-lg ${isTeamNull ? 'opacity-50' : 'opacity-100'}`}
                />
                <p className={`text-xs font-bold ${isTeamNull ? 'opacity-50' : ''}`}>{team?.teamId?.teamName || "No Team"}</p>
            </div>
            <div className="col-span-1 border-l-2 border-gray-800 flex items-center justify-center">
            <p className={`text-3xl font-bold ${isTeamNull ? 'opacity-50' : ''}`}>
                    {isTeamNull ? "-" : team.score}
                </p>
            </div>
        </div>
    )
}
