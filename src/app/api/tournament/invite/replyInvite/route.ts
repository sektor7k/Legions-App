import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Invite from '@/models/Invite';
import Team, { TeamDocument, Member } from '@/models/Team';
import { updateParticipantsCount } from '@/helpers/participantscount';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    const { id, reply } = await request.json();

    await connectDB();

    try {
        if (!Team || !User) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }
        const invite = await Invite.findById(id).populate('userId', 'username image').populate('teamId', 'teamName teamImage');

        if (!invite) {
            return NextResponse.json({ message: 'Invite not found' }, { status: 404 });
        }

        

        if (reply === 'accept') {
            if (invite.inviteType === 'leader') {
                const userInTeam = await Team.findOne({ 'members.memberId': invite.leadId, isDeleted: false });
    
                if (userInTeam) {
                    return NextResponse.json({
                        message: 'The user is already registered to a team',
                    }, { status: 400 });
                }
            }
            if (invite.inviteType === 'member') {
                const userInTeam = await Team.findOne({ 'members.memberId': invite.userId, isDeleted: false });
    
                if (userInTeam) {
                    return NextResponse.json({
                        message: 'You have already joined a team',
                    }, { status: 400 });
                }
            }
            
            invite.status = 'accepted';
            await invite.save();

            const team = await Team.findById(invite.teamId) as TeamDocument;

            if (!team) {
                return NextResponse.json({ message: 'Team not found' }, { status: 404 });
            }

            const userAlreadyInTeam = team.members.some((member: Member) =>
                member.memberId.equals(invite.userId)
            );

            await updateParticipantsCount({
                countType: "increase",
                countSize: 1,
                tournamentId: team.tournamentId,
            });
            
            if (!userAlreadyInTeam) {
                team.members.push({ memberId: invite.userId, isLead: false });
                await team.save();
            }

            return NextResponse.json({ message: 'Invite accepted and user added to team', invite }, { status: 200 });
        } else if (reply === 'reject') {
            invite.status = 'rejected';
            await invite.save();
            return NextResponse.json({ message: 'Invite rejected', invite }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Invalid reply type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error processing invite:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
