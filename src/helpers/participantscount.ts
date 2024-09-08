import Tournament from '@/models/Tournament'; // Tournament modelinizi buradan alın
import { Types } from 'mongoose';

// Katılımcı sayısını artırıp azaltacak fonksiyon
export const updateParticipantsCount = async ({
  countType,
  countSize,
  tournamentId
}: {
  countType: 'increase' | 'decrease';
  countSize: number;
  tournamentId: Types.ObjectId;
}) => {
  try {
    // Turnuva verisini buluyoruz
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    // Mevcut katılımcı sayısını alıyoruz
    let currentParticipants = tournament.participants || 0;

    // Katılımcı sayısını güncelliyoruz
    if (countType === 'increase') {
      currentParticipants += countSize;
    } else if (countType === 'decrease') {
      currentParticipants = Math.max(0, currentParticipants - countSize); // 0'dan aşağı düşmesini engelle
    }

    // Yeni katılımcı sayısını turnuvaya kaydediyoruz
    tournament.participants = currentParticipants;
    await tournament.save();

    return { success: true, currentParticipants };
  } catch (error: any) {
    console.error('Error updating participants count:', error.message);
    return { success: false, error: error.message };
  }
};
