import { Schema, model, models, Document, Types } from 'mongoose';

export interface MatchDocument extends Document {
  tournamentId: Types.ObjectId;
  team1Id: Types.ObjectId;
  team2Id: Types.ObjectId;
  matchDate: string;
  matchTime: string;
}

const matchSchema = new Schema<MatchDocument>({
  tournamentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tournament', // Tournament modelinden referans
  },
  team1Id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Team', // Team modelinden referans
  },
  team2Id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Team', // Team modelinden referans
  },
  matchDate: {
    type: String,
    required: true,
  },
  matchTime: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
});

const Match = models.Match || model<MatchDocument>('Match', matchSchema);

export default Match;
