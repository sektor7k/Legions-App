import { Schema, model, models, Document } from 'mongoose';

export interface BetStreamDocument extends Document {
    message: string;
    username: string;
    userAvatar: string;
}

const betStreamSchema = new Schema<BetStreamDocument>({
    message: {
        type: String,
        required: true,   
    },
    username: {
        type: String,
        required: true,   
    },
    userAvatar: {
        type: String,
        required: true,   
    },
    
}, {
    timestamps: true,
});

const BetStream = models.BetStream || model<BetStreamDocument>('BetStream', betStreamSchema);

export default BetStream;

