import { NextRequest, NextResponse } from "next/server";
import Result from "@/models/Result";
import Team from "@/models/Team";  // Takım modeli
import User from "@/models/User";  // Kullanıcı modeli
import { connectDB } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { tournamentId } = await request.json();
        
        if (!Team  || !Result || !User) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }
        if (!tournamentId) {
            return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
        }

        // Turnuvanın sonuçlarını çek ve takımları popüle et
        const result = await Result.findOne({ tournamentId }).populate("teams.teamId");

        if (!result) {
            return NextResponse.json({ message: "No results found", results: [] }, { status: 200 });
        }

        // Takım üyelerini çekmek için takım ID'leri ile sorgu yap
        const teamIds = result.teams.map((team: any) => team.teamId._id);
        const teamsWithMembers = await Team.find({ _id: { $in: teamIds } }).populate("members.memberId", "username image");

        // Takımları `teamId` bazlı bir nesne olarak sakla
        const teamMap = new Map();
        teamsWithMembers.forEach((team) => {
            teamMap.set(team._id.toString(), {
                _id: team._id,
                teamName: team.teamName,
                teamImage: team.teamImage,
                members: team.members.map((member: any) => ({
                    memberId: member.memberId._id,
                    username: member.memberId.username,
                    image: member.memberId.image,
                    isLead: member.isLead,
                })),
            });
        });

        // Sonuçları frontend için uygun formatta hazırla
        const formattedResults = result.teams.map((team: any) => ({
            position: team.position,
            team: teamMap.get(team.teamId._id.toString()), // Takım bilgileri ve üyeleri buradan gelir
            wins: team.win,
            losses: team.lose,
            draws: team.draw,
        }));

        return NextResponse.json(formattedResults, { status: 200 });
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
