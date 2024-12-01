import { Schema, model, models, Document, Types } from 'mongoose';

export interface BetDocument extends Document {
    founderId: Types.ObjectId;
    tournamentId: Types.ObjectId;
    matchId: Types.ObjectId;
    founderTeamId: Types.ObjectId;
    stake: Number;
    status: 'open' | 'closed' | 'completed';
    opponentId?: Types.ObjectId;
    opponentTeamId?: Types.ObjectId;
    winnerId?: Types.ObjectId;
}

const betSchema = new Schema<BetDocument>({
    founderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tournamentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Tournament',
    },
    matchId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Match',
    },
    founderTeamId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team',
    },
    stake: {
        type: Number,  // Değiştirildi
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'completed'],
        required: true,
    },
    opponentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    opponentTeamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    winnerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
});

const Bet = models.Bet || model<BetDocument>('Bet', betSchema);

export default Bet;

