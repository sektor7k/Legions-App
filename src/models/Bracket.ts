import mongoose, { Schema, Document, Types } from 'mongoose';

// Bracket için takım yapısı
interface TeamInBracket {
  teamId: Types.ObjectId;
  score: number;
  round: number;
}

// Bracket Modeli
interface BracketDocument extends Document {
  tournamentId: Types.ObjectId;
  teams: TeamInBracket[];
}

const TeamInBracketSchema = new Schema<TeamInBracket>({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  score: {
    type: Number,
    default: 0,
  },
  round: {
    type: Number,
    required: true,
  },
});

const BracketSchema = new Schema<BracketDocument>({
  tournamentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tournament',
  },
  teams: [TeamInBracketSchema],
  
},
{
    timestamps: true, 
  });

const Bracket = mongoose.models.Bracket || mongoose.model<BracketDocument>('Bracket', BracketSchema);

export default Bracket;
