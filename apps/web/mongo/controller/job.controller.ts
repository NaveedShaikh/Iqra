
import {
  createEmail,
  findEmailByEmailType,
} from '../service/admin/email.service'
import { requireUser, requireEmployer, requireCandidate } from '../middleware/authenticate'
import {
  findJob,
  findAdminJob,
  jobstatusUpdate,
  deleteJobService,
  createJobSeivice,
  getCountJobPrivateService,
  updateJobService,
  getTotalCountService,
  getSearchJobsService,
  getSingleJobService,
  getJobsService,
  jobExperinceCountService,
  jobTypescountService,
} from '../service/job.service'
import { getUserWithPackage } from '../service/user.service'
import connectDB from '../utils/connect'
import JobModel from '../models/job.model'
import ScheduledmeetModel from '../models/scheduledmeet.model'
import UserModel from '../models/user.model'
import { generateMail } from '@/utils/generateEmail'
import { sendTakeInterviewInvitaionMail } from '../utils/nodeMailer'
import HireModel from '../models/hire.model'

// create job handller
export async function createJob(reqQuery: any) {
  try {
    const { accessToken, jobData, headerImage } = reqQuery
    const userInfo = await requireEmployer(accessToken)
    const userId = userInfo._id
    const userEmail = userInfo.email
    const userRole = userInfo.role

    const user = await getUserWithPackage(userId)

    const { validity, totalJobs, featuredJobs } = user?.package
    //find the admin role and allow post without limit
    if (userRole.isEmployer || userRole.isCandidate == true) {
      // find the user total job
      const jobCount = await getCountJobPrivateService({ user: userId })

      if (jobCount >= totalJobs) {
        throw new Error('You have reached your job limit')
      }
    }

    const jobInputData = {
      ...jobData,
      user: userId,
      expireAt: new Date(new Date().setDate(new Date().getDate() + validity)),
    }

    const job = await createJobSeivice(jobInputData, headerImage)

    // TODO : [x] need to remove this code after successfully migration
    // const emailType = 'JOB_PUBLISHED'
    // let emails
    // emails = await findEmailByEmailType(emailType)
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: 'Meta-Jobs',
    //     subject: 'Your Job is Live',
    //     message: 'Congrats..!! Your Job is published',
    //     emailType: 'JOB_PUBLISHED',
    //   }
    //   await createEmail(templateInput)
    //   emails = await findEmailByEmailType('JOB_PUBLISHED')
    // }
    // const emailData = emails[0]

    // const inputEmailData = {
    //   userEmail,
    //   emailData,
    //   emailType,
    //   userId,
    // }

    // await sendNotificationEmail(inputEmailData)

    return job
  } catch (e) {
    throw e
  }
}


// create job handller
export async function addJobState(state: string,jobId: string) {
  try {
    const job = await JobModel.findById(jobId);
    console.log(job);
    job.states.push(state);
    await job.save();
  } catch (e) {
    throw e
  }
}


// create scheduled handller
export async function addSchdule(reqQuery:any) {
  try {
    const { accessToken, jobData, user_id } = reqQuery
    const userInfo = await requireEmployer(accessToken)
    const user = userInfo._id;

    
    const scheduled = await ScheduledmeetModel.create({...jobData,user});
    //send meeting

    const candidate = await UserModel.findById(jobData.candidate);

    const candidateHtml = generateMail(`
      
      Subject: Interview Invitation: ${jobData.title}

      Dear Candidate,

      We are pleased to inform you that you have been shortlisted for an interview. Below are the details:

      - Title: ${jobData.title}
      - Type: ${jobData.type}
      - Date & Time: ${new Date(jobData.dateTime).toLocaleString()}
      - **Link (for Online Interview):** ${jobData.linkAddress ? jobData.linkAddress : 'N/A'}
      - **Notes:** ${jobData.notes ? jobData.notes : 'No additional notes'}
      Please ensure that you are available at the scheduled time. Feel free to reach out if you have any questions.

      Best Regards
    `)


    const employerHtml = generateMail(`
      Subject: Interview Schedule Confirmation: ${jobData.title}

      Dear Employer,

      An interview has been scheduled with the following details:

      - Title: ${jobData.title}
      - Type: ${jobData.type}
      - Candidate UUID: ${jobData.uuid}
      - Date & Time: ${new Date(jobData.dateTime).toLocaleString()}
      - Link (for Online Interview): ${jobData.linkAddress ? jobData.linkAddress : 'N/A'}
      - Notes: ${jobData.notes ? jobData.notes : 'No additional notes'}

      Please review the schedule and prepare accordingly. Let us know if there are any conflicts.

      Best Regards, 
    `)

    await sendTakeInterviewInvitaionMail("Meeting Sheduled",candidateHtml,candidate.email)
    await sendTakeInterviewInvitaionMail("Meeting Sheduled",employerHtml,userInfo.email)

    return scheduled;
  } catch (e) {
    throw e
  }
}


// create hire handller
export async function HireCondidate(reqQuery:any) {
  try {
    const { accessToken, jobData } = reqQuery
    const userInfo = await requireEmployer(accessToken)
    const user = userInfo._id;

    
    const hire = await HireModel.create({...jobData,user});
    //send meeting

    const candidate = await UserModel.findById(jobData.candidate);

    const candidateHtml = generateMail(`
      Subject: Job Offer for the Position of ${jobData.position}

      Dear ${jobData.candidateName},

      Congratulations! We are delighted to offer you the position of **${jobData.position}** at our company.

      Here are the key details of the offer:

      - Position: ${jobData.position}  
      - Salary: ${jobData.salary}  
      - Offer Type: ${jobData.offer}  
      - Contract Duration: ${jobData.contract ? jobData.contract : 'Not specified'}  
      - Job ID: ${jobData.jobid}  

      ${jobData.notes ? `Additional Notes: ${jobData.notes}` : 'No additional notes at this time.'}

      Please take your time to review the offer. If you have any questions or need clarifications, feel free to reach out to us.

      Looking forward to welcoming you onboard!
    `)


    

    await sendTakeInterviewInvitaionMail("Meeting Sheduled",candidateHtml,candidate.email)

    return hire;
  } catch (e) {
    throw e
  }
}

// get a job handller
export async function getSingleJob(jobID: string) {
  try {
    const jobResult = await getSingleJobService(jobID)

    if (!jobResult) {
      throw new Error('Job Not Found')
    }
    return jobResult
  } catch (e) {
    throw e
  }
}

// find all job public
export async function getJobs() {
  await connectDB();
  try {
    const jobs = await getJobsService()
    // if (jobs.length === 0) {
    //     throw new Error('No jobs found')
    // }
    return jobs
  } catch (e) {
    throw e
  }
}

// find all job handller private
export async function getJobsPrivate(accessToken: string) {
  try {
    const user = await requireUser(accessToken)
    const userID = user?._id
    const adminRole = user.role.isAdmin

    if (adminRole === true) {
      const jobs = await findAdminJob()
      return jobs
    }

    const jobs = await findJob(userID)
    return jobs
  } catch (e) {
    throw e
  }
}

// Search and Filter  jobs handller
export async function getSearchJobs(query: any) {
  await connectDB();
  try {
    const jobResult = await getSearchJobsService(query)

    const jobTypesResult = await jobTypescountService()
    const jobExpResult = await jobExperinceCountService()

    const data = {
      jobs: jobResult.jobs,
      totalJobCount: jobResult.jobCount,
      filter: {
        jobTypes: jobTypesResult,
        jobExperience: jobExpResult,
      },
    }

    return data
  } catch (e: any) {
    throw e
  }
}

// find total job, resume, company
export async function getTotalCount(req?: Request, res?: Response) {
  try {
    const totalCount = await getTotalCountService()
    return totalCount
  } catch (e) {
    throw e
  }
}

// job status update
export async function updateJobStatus(rewQuery: any) {
  try {
    const user = (await requireUser(rewQuery.accessToken)) as any
    const query = {
      userId: user._id,
      adminRole: user.role.isAdmin,
      jobId: rewQuery.jobId,
      jobStatus: rewQuery.jobStatus,
    }

    const jobs = await jobstatusUpdate(query)
    return jobs
  } catch (e) {
    throw e
  }
}

// update job handller
export async function updateJob(reqQuery: any) {
  try {
    const { accessToken, jobData, headerImage, jobID } = reqQuery

    const user = await requireEmployer(accessToken)
    const userID = user._id
    // update a job
    const job = await updateJobService(jobID, jobData, headerImage)

    if (!job) {
      throw new Error('Job Not Found')
    }
    return job
  } catch (e) {
    throw e
  }
}

// job status update
export async function deleteJob(reqQuery: any) {
  try {
    const user = (await requireUser(reqQuery.accessToken)) as any
    const userID = user._id
    const jobId = reqQuery.jobId

    const job = await deleteJobService(jobId)
    if (!job) {
      throw new Error('Job Not Found')

    }

    // TODO : [x] need to remove this code after successfully migration
    // const emailType = 'JOB_DELETED'
    // let emails
    // emails = await findEmailByEmailType(emailType)
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: 'Meta-Jobs',
    //     subject: 'Your Job is Deleted',
    //     message: 'You have deleted a job',
    //     emailType: 'JOB_DELETED',
    //   }
    //   await createEmail(templateInput)
    //   emails = await findEmailByEmailType('JOB_DELETED')
    // }
    // const emailData = emails[0]

    // const inputEmailData = {
    //   userEmail: user.email,
    //   emailData,
    //   jobInfo: job,
    //   userId: userID,
    //   emailType,
    // }
    // sendNotificationEmail(inputEmailData)
    return job
  } catch (e) {
    throw e
  }
}
