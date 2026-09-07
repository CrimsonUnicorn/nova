import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  project: mongoose.Types.ObjectId
  assignedTo?: mongoose.Types.ObjectId
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

const Task = mongoose.model<ITask>('Task', taskSchema)

export default Task