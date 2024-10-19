import mongoose, { Schema, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends Document, IUser {

}

// Create a schema using the Schema class
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validator: isURL,
  },
  password: {
    type: String, required: true, select: false, unique: true,
  },
  email: {
    type: String, required: true, unique: true, email: isEmail,
  },
});

const User = mongoose.model<IUserModel>('users', UserSchema);

export default User;
