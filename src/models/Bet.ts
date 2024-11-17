import { Schema, model, models, Document, Types } from 'mongoose';

export interface BetDocument extends Document {
    founderId: Types.ObjectId;
    tournamentId: Types.ObjectId;
    matchId: Types.ObjectId;
    selectedTeamId: Types.ObjectId;
    stake: Number;

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
    selectedTeamId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team',
    },
    stake: {
        type: Number,  // Değiştirildi
        required: true,
    }
}, {
    timestamps: true,
});


const Bet = models.Bet || model<BetDocument>('Bet', betSchema);

export default Bet;
