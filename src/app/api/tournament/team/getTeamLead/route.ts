import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { tournamentId, leadId } = reqBody; // İstekten tournamentId ve leadId alınıyor

    if (!tournamentId || !leadId) {
        return NextResponse.json({ message: 'tournamentId and leadId are required' }, { status: 400 });
    }

    await connectDB();

    try {
     
    
        // Kullanıcı bir takımda ancak lider mi?
        const leaderTeam = await Team.findOne({ 
            tournamentId, 
            members: { 
                $elemMatch: { 
                    memberId: leadId, 
                    isLead: true 
                } 
            }, 
            isDeleted: false 
        });

        // Eğer kullanıcı bir lider değilse hata döndür
        if (!leaderTeam) {
            return NextResponse.json({ message: 'User is not the leader of any team in this tournament' }, { status: 403 });
        }

        // Eğer kullanıcı takım lideriyse, takım bilgilerini gönder
        return NextResponse.json(leaderTeam, { status: 200 });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Server error', error: error }, { status: 500 });
    }
}
