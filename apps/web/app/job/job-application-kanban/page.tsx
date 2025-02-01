"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import MangeJobsList from "@/src/components/dashboard/job/manage-jobs-list";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import { Kanban } from "lucide-react";
import KanbanView from "@/src/components/dashboard/job/KanbanView";
import useSWR from "swr";
import { authAxios } from "@/src/components/utils/axiosKits";
import { useEffect, useState } from "react";
import AddState from "@/src/components/dashboard/job/AddState";

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
export default function JobApplication() {
    const [selectJob, setSelectJob] = useState('');
    const [addStateOpen, setAddStateOpen] = useState(false)
    const { data: userSessiondata, status } = useSession();
    const userData = userSessiondata?.user as any;
    const isCandidate = userData?.role.isCandidate;
    const { data, error, isLoading } = useSWR("/jobs/private", fetcher);

    useEffect(() => {
        if (data) {

            setSelectJob(data[0]?._id);
        }
    }, [data]);
    return (
        <>
            <Head>
                <meta name="description" content="Manage your job" />
            </Head>

            <Layout>
                <main>
                    {status === "unauthenticated" && <UserNotLogin />}
                    {isCandidate && <UserGoBack />}
                    {userData && status === "authenticated" && !isCandidate && (
                        <>
                            
                            <div className="flex justify-between items-center mb-10">
                                <select className="px-2 py-2 border border-grayLight rounded-md" style={{ width: "180px" }} value={selectJob} onChange={(e) => setSelectJob(e.target.value)}>
                                    {
                                        data && data.map((post: any) => (
                                            <option value={post._id}>{post.jobTitle}</option>
                                        ))
                                    }
                                </select>

                                <button className="!py-3 px-8 bg-themePrimary rounded-lg shadow-themePrimary text-white" onClick={() => setAddStateOpen(true)}>
                                    Add Stage
                                </button>
                            </div>

                            {
                                !isLoading && data?.length == 0 &&
                                <h1 className="text-xl text-black text-center">
                                    No Jobs Found
                                </h1>
                            }

                            <KanbanView jobId={selectJob} />
                        </>
                    )}

                </main>
            </Layout>

            <AddState open={addStateOpen} onClose={() => setAddStateOpen(false)} id={selectJob} />

        </>
    );
}
