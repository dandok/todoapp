import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export interface DataDocument extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    tokens: {token:string}[],
    generateAuthToken(): string
}

interface DataModel extends mongoose.Model<DataDocument>{
  findByCredentials(email: string, password: string): DataDocument 
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      requred: true,
      trim: true,
      minLength: 7,
      validate(value: string) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain password');
        }
      },
    },
    tokens:[
      {
        token:{
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform(a,b){
        delete b.password
      }
    }
  }
);

userSchema.virtual('tasks', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'owner'
})



userSchema.methods.generateAuthToken = async function(){
  const user = this
  const secret = process.env.SECRET_KEY as string

  const token = jwt.sign({_id: user._id.toString()}, secret)
  let userToken = this.get('tokens')
  
  this.set('tokens', userToken.concat({token}))//explain
  userToken = userToken.concat({token})//any need?

  await user.save()

  return token
}


userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({email})
  
  if(!user){
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch){
    throw new Error('Unable to login')
  }
  return user
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    let plainTextPassword = this.get('password');
    this.set('password', await bcrypt.hash(plainTextPassword, 8));
  }
  next();
});

const User = mongoose.model<DataDocument, DataModel>('User', userSchema);


export default User;
