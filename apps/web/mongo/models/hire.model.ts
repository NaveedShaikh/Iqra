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
    candidateName: {
        type: String,

    },
    position: {
        type: String,

    },
    salary: {
        type: String,

    },
    offer: {
        type: String,
    },
    contract: {
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

const HireModel = mongoose.models.Hire || mongoose.model<JobDocument>('Hire', jobSchema);


export default HireModel