import axios from "axios";


const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`
});

export const registerOnEventRequest = async (formData:any) => api.post('/events/register-event', formData);
export const registerOnOpportunityRequest = async (formData:any,id:string) => api.post(`/events/register-on-oppotunity/${id}`, formData);
export const verifiedInterviewerRequest = async (formData:any,token:string) => api.post(`/events/verify-interview/${token}`, formData);
export const getCandidateResumeRequest = async (id:string) => api.get(`/resumes/get-resume-by-id/${id}`);
export const addStateOnJOb = async (id:string,formData:any) => api.post(`/jobs/add-state/${id}`,formData);
export const schdeuledMeetRequest = async (id:string,formData:any) => api.post(`/jobs/scheduled-meeting/${id}`,formData);
export const HireCondidateRequest = async (id:string,formData:any) => api.post(`/jobs/hire-candidate/${id}`,formData);