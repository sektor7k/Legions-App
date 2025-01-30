import { Schema, model, models, Document, Types } from 'mongoose';

export interface MatchDocument extends Document {
  tournamentId: Types.ObjectId;
  team1Id: Types.ObjectId;
  team2Id: Types.ObjectId;
  team1Score: String;
  team2Score: String;
  matchDate: string;
  matchTime: string;
  isDeleted: boolean;
  status: "incoming" | "ongoing" | "played";
  winnerTeam: Types.ObjectId;
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
  team1Score: {
    type: String,
    default: "0"
  },
  team2Score: {
    type: String,
    default: "0"
  },
  matchTime: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["incoming", "ongoing", "played"],
    default: "incoming",
  },
  winnerTeam: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },

}, {
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
});

const Match = models.Match || model<MatchDocument>('Match', matchSchema);

export default Match;
