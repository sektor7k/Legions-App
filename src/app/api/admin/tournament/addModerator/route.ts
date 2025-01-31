import { connectDB } from '@/lib/mongodb';
import Tournament from '@/models/Tournament';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const reqBody = await request.json();
    const { id, moderatorIds } = reqBody;

    // Temel bir doğrulama
    if (!id || !moderatorIds || !Array.isArray(moderatorIds)) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 403 });
    }


    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { $set: { moderators: moderatorIds } },
      { new: true }
    );

    if (!updatedTournament) {
      return NextResponse.json({ message: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Moderators updated successfully',
      updatedTournament
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating moderators:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
