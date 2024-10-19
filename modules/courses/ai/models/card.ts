import mongoose, { Schema, Document } from 'mongoose';
import isURL from 'validator/lib/isURL';

export interface ICard {
    name: string;
    link: string;
    owner: Schema.Types.ObjectId;
    likes: Schema.Types.ObjectId[];
    createdAt: Date;
}

interface ICardModel extends Document, ICard { }

const CardSchema: Schema = new Schema({
  name:
    {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  link: {
    type: String,
    required: true,
    validate: {
      validator: isURL,
    },
  },
  owner: { type: Schema.Types.ObjectId, required: true },
  likes: { type: Array<Schema.Types.ObjectId>, default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Card = mongoose.model<ICardModel>('Card', CardSchema);

export default Card;
