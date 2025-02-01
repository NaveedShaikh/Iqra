import mongoose from 'mongoose'
import { CompanyDocument } from './company.model'
import { UserDocument } from './user.model'

export interface JobDocument extends mongoose.Document {

}

const jobSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    jobid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    },
    title: {
        type: String,

    },
    type: {
        type: String,

    },
    linkAddress: {
        type: String,

    },
    dateTime: {
        type: Date,
    },
    interviews: {
        type: String,
    },
    notes: {
        type: String,
    },
    uuid: {
        type: String,
    }
  },
  {
    timestamps: true,
  }
)

const ScheduledmeetModel = mongoose.models.scheduledmeet || mongoose.model<JobDocument>('scheduledmeet', jobSchema);


export default ScheduledmeetModel