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
  isDeleted: boolean;
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
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  },
  members: [memberSchema],
}, {
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
});

// 'remove' hook 
teamSchema.pre('findOneAndDelete', async function (next) {
  try {
    const team = this.getQuery(); // Silinen takıma erişim
    const Invite = model('Invite'); // Invite modelini kullanarak referans alın
    // Bu takım ile ilgili tüm davetleri sil
    await Invite.deleteMany({ teamId: team._id });
    next();
  } catch (error: any) {
    next(error);
  }
});

const Team = models.Team || model<TeamDocument>('Team', teamSchema);

export default Team;
