import { HireCondidateRequest } from '@/http/event';
import { useParams, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast';

const Hire = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id;
    const jobid = searchParams.get("jobid")
    const candidateNameQuery = searchParams.get("name")
    const positionQuery = searchParams.get("position")

    const [candidateName, setCandidateName] = useState(candidateNameQuery);
    const [position, setPosition] = useState(positionQuery);
    const [salary, setSalary] = useState('');
    const [offer, setOffer] = useState('');
    const [contract, setContract] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false)



    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formdata = new FormData();
            formdata.append('candidateName', candidateName as string);
            formdata.append('position', position as string);
            formdata.append('salary', salary);
            formdata.append('offer', offer);
            formdata.append('contract', contract);
            formdata.append('notes', notes);
            formdata.append('jobid', jobid as string);
            const res = await HireCondidateRequest(params.id as string, formdata);
            toast.success(res?.data?.message);
            setCandidateName('')
            setPosition('online')
            setSalary('')
            setOffer('')
            setContract('')
            setNotes('')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message)
        } finally {
            setLoading(false)
        }
    }, [jobid, candidateName, position, salary, offer, contract, notes]);

    return (
        <main className="flex-1 p-6 bg-gray-50">
            <form className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                {/* Left Column - Candidate Information */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Candidate Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600">Name</label>
                            <input
                                type="text"
                                value={candidateName as string}
                                onChange={(e) => setCandidateName(e.target.value)}
                                className="block w-full rounded-md border-grayLight border shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2"
                                placeholder='Name'

                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Position</label>
                            <input
                                value={position as string}
                                onChange={(e) => setPosition(e.target.value)}
                                type="text"
                                className="block w-full rounded-md border-grayLight border shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2"
                                placeholder='Position'
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Contract Management */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Contract Management</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Salary Offer</label>
                            <input
                                type="text"
                                className="block w-full rounded-md border-grayLight border shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2"
                                value={salary as string}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Offer Letter</label>
                            <textarea
                                className="block w-full rounded-md border-grayLight border shadow-sm focus:border-blue-500 focus:ring-blue-500 h-[5rem] p-2"
                                placeholder='Offer Letter'
                                value={offer as string}
                                onChange={(e) => setOffer(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Contract Terms</label>
                            <textarea
                                value={contract as string}
                                onChange={(e) => setContract(e.target.value)}
                                className="block w-full rounded-md border-grayLight border shadow-sm focus:border-blue-500 focus:ring-blue-500 h-[8rem] p-2"
                                placeholder='Start date: 1st Jan 2024, Benefits: Health, Dental, Vision, Bonuses: Annual performance-based.'
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Notes/Comments</label>
                            <textarea placeholder='Notes/Comments' className="block w-full rounded-md border-grayLight border shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32" value={notes as string}
                                onChange={(e) => setNotes(e.target.value)}></textarea>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-40" disabled={loading}>

                                {
                                    loading ? "Loading..." : "Send Offer"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default Hire