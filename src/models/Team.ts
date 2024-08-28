import { Schema, model, models, Document, Types } from 'mongoose';

export interface Member {
  memberId: Types.ObjectId;
  isLead: boolean;
}

export interface TeamDocument extends Document {
  tournamentId: Types.ObjectId;
  teamName: string;
  teamImage: string;
  status: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<Member>({
  memberId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  isLead: {
    type: Boolean,
    default: false,
  },
});

const teamSchema = new Schema<TeamDocument>({
  tournamentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tournament',
  },
  teamName: {
    type: String,
    required: true,
  },
  teamImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  members: [memberSchema],
}, {
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
});

const Team = models.Team || model<TeamDocument>('Team', teamSchema);

export default Team;
