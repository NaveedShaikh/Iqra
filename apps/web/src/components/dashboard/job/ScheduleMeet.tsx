'use client'
import { schdeuledMeetRequest } from '@/http/event'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {v4 as UUID} from 'uuid'

const ScheduleMeet = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const jobid = searchParams.get('jobid')
    const id:string = params.id as string;
    const [title,setTitle] = useState('');
    const [type,setType] = useState('online');
    const [linkAddress,setLinkAddress] = useState('');
    const [dateTime,setDateTime] = useState('');
    const [interviews,setInterviews] = useState('');
    const [notes,setNotes] = useState('');
    const [uuid, setUuid] = useState(UUID());
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        if(type == 'online'){
            setLinkAddress(`${process.env.NEXT_PUBLIC_BASE_URL}/schedule-meeting/${uuid}`);
        }
    },[type,uuid]);



    const handleSubmit = useCallback(async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formdata = new FormData();
            formdata.append('title',title);
            formdata.append('type',type);
            formdata.append('linkAddress',linkAddress);
            formdata.append('dateTime',dateTime);
            formdata.append('interviews',interviews);
            formdata.append('notes',notes);
            formdata.append('uuid',uuid);
            formdata.append('jobid',jobid as string);
            const res = await schdeuledMeetRequest(params.id as string,formdata);
            toast.success(res?.data?.message);
            setTitle('')
            setType('online')
            setLinkAddress('')
            setDateTime('')
            setInterviews('')
            setNotes('')
        } catch (error:any) {
            toast.error(error?.response?.data?.message || error?.message)
        }finally{
            setLoading(false)
        }
    },[jobid,title,type,linkAddress,dateTime,interviews,notes,uuid,jobid]);
    
    return (
        <main className="max-w-5xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-8">Schedule Interview</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name & Job Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="John Doe - Software Engineer"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"  required={true}
                                
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value={'online'}>Online</option>
                                    <option value={'physically'}>Physically</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location/Meeting Link</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="123 Main St or https://meetinglink.com"
                                    value={linkAddress}
                                    onChange={(e) => setLinkAddress(e.target.value)}
                                    required={true}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date & Time</label>
                                <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={dateTime} onChange={(e) => setDateTime(e.target.value)}/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer(s)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Interviewer(s)"
                                    required={true}
                                    value={interviews}
                                    onChange={(e) => setInterviews(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Notes</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                                    placeholder="Add any notes or instructions..."
                                    required={true}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={loading}
                            type="submit"
                            className={`px-6 py-2 bg-themePrimary text-white rounded-md hover:bg-themePrimary focus:outline-none disabled:opacity-40`}
                        >
                            {
                                loading ? "Loading..." : "Save/Send Invite"
                            }
                            
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default ScheduleMeet