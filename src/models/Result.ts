import mongoose, { Schema, Document, Types } from 'mongoose';

interface TeamInResult {
    position: number;
    teamId: Types.ObjectId;
    win: number;
    lose: number;
    draw: number;
}

interface ResultDocument extends Document {
    tournamentId: Types.ObjectId;
    teams: TeamInResult[];
}

const TeamInResultSchema = new Schema<TeamInResult>({
    position: {
        type: Number,
        default: 0,
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    win: {
        type: Number,
        default: 0,
    },
    lose: {
        type: Number,
        default: 0,
    },
    draw: {
        type: Number,
        default: 0,
    },
});

const ResultSchema = new Schema<ResultDocument>({
    tournamentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Tournament',
    },
    teams: [TeamInResultSchema],

},
    {
        timestamps: true,
    });

const Result = mongoose.models.Result || mongoose.model<ResultDocument>('Result', ResultSchema);

export default Result;
