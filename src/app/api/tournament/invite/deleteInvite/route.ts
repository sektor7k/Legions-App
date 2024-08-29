import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Invite from '@/models/Invite';

export async function POST(request: NextRequest) {
    const { inviteId } = await request.json();

    await connectDB();

    try {
        // Daveti ID'ye göre bul ve sil
        const invite = await Invite.findByIdAndDelete(inviteId);

        if (!invite) {
            return NextResponse.json({ message: 'Invite not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Invite deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting invite:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
