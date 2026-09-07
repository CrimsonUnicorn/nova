import mongoose, { Schema, Document } from 'mongoose'

export interface IProjectMember extends Document {
  project: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  role: 'member' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  },
)

projectMemberSchema.index(
  { project: 1, user: 1 },
  { unique: true },
)

const ProjectMember = mongoose.model<IProjectMember>(
  'ProjectMember',
  projectMemberSchema,
)

export default ProjectMember