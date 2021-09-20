import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: String,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model('todo', todoSchema);

export default Todo;
