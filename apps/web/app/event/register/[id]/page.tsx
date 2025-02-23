"use client"
import { registerOnEventRequest } from "@/http/event";
import { User } from "@/interface/AuthInterface";
import CreateWorkFlow from "@/src/components/dashboard/event/create-workflow";
import RegisterForm from "@/src/components/dashboard/event/register-form";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import { authAxios } from "@/src/components/utils/axiosKits";
import { AxiosError } from "axios";
import { set } from "lodash";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";


interface Room {
  interviewerName: string
  interviewerEmail: string
  _id?: string,
  accessToken?: string
}

export interface Round {
  name: string
  description: string
  roundType: string
  index: number;
  rooms: Room[]
}

interface IProps {
  params: { id: string }
}

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);

const Page: FC<IProps> = ({ params }) => {
  const [step, setStep] = useState<'register' | 'workflow'>('register');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const { data, status } = useSession();
  const [alreadyRegisterDeatils, setAlreadyRegisterDeatils] = useState<any>(null);
  const [rounds, setRounds] = useState<Round[]>([
    { name: `Round 1`, description: '', roundType: '', index: 0, rooms: [{ interviewerName: '', interviewerEmail: '' }] }
  ]);
  const [quizConfig, setQuizConfig] = useState({
    mode: 'medium',
    difficulty: 'medium',
    topic: '',
    keywords: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const userData = data?.user as User;
  const isCandidate = userData?.role?.isCandidate;
  const { data: opportunity, error } = useSWR(`/events/opportunity/${params.id}`, fetcher);



  useEffect(() => {
    if (opportunity?.length > 0) {
      setAlreadyRegisterDeatils(opportunity[0]);
    }
  }, [opportunity]);



  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = {
        rounds,
        name,
        description,
        role,
        event_id: params.id,
        quizConfig
      }
      const res = await registerOnEventRequest(formdata);
      setStep('register');
      setName('');
      setDescription('');
      setRole('');
      setRounds([{ name: `Round 1`, description: '', roundType: '', index: 0, rooms: [{ interviewerName: '', interviewerEmail: '' }] }]);
      toast.success(res.data.message);
      setAlreadyRegisterDeatils(res.data.data);
    } catch (error) {
      toast.error((error as AxiosError<{ message: string }>).response?.data?.message || (error as Error).message);
    } finally {
      setLoading(false);
    }

  }, [rounds, name, description, role, params.id, quizConfig]);



  const copyToClipboard = useCallback((_id: string, accessToken: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/interview-room/${_id}?accessToken=${accessToken}`)
        .then(() => {
          toast.success("Text copied to clipboard")
        })
        .catch(err => {
          toast.error("Failed to copy text to clipboard:", err);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Dashboard- Bookmark jobs, upcoming events and register"
        />
      </Head>

      <Layout>
        <main className="">
          {status === "unauthenticated" && <UserNotLogin />}
          {isCandidate && <UserGoBack />}
          {userData && status === "authenticated" && !isCandidate && !alreadyRegisterDeatils && (
            <>
              {
                step === 'register' ? <RegisterForm quizConfig={quizConfig} setQuizConfig={setQuizConfig} setStep={setStep} name={name} description={description} role={role} setName={setName} setDescription={setDescription} setRole={setRole} />
                  : <CreateWorkFlow rounds={rounds} setRounds={setRounds} handleSubmit={handleSubmit} loading={loading} />
              }
            </>
          )}

          {userData && status === "authenticated" && !isCandidate && alreadyRegisterDeatils && (
            <>

              <div className="bg-white shadow-md p-5 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-md h-[15rem] bg-yellow-500 flex flex-col items-center justify-center">
                    <h1 className="text-white text-lg opacity-60">Name</h1>
                    <h1 className="text-white text-xl">{alreadyRegisterDeatils.name}</h1>
                  </div>
                  <div className="p-4 rounded-md h-[15rem] bg-purple-500 flex flex-col items-center justify-center">
                    <h1 className="text-white text-lg opacity-60">Role</h1>
                    <h1 className="text-white text-xl">{alreadyRegisterDeatils.role}</h1>
                  </div>
                  <div className="p-4 rounded-md h-[15rem] bg-blue-500 flex flex-col items-center justify-center">
                    <h1 className="text-white text-lg opacity-60">Total Round</h1>
                    <h1 className="text-white text-xl">{alreadyRegisterDeatils.rounds?.length}</h1>
                  </div>
                </div>

                <div className=" mt-10">
                  <h1 className="text-4xl text-center">Interview Rooms Links</h1>
                  <div className="space-y-8 flex flex-row w-full overflow-x-auto p-2">
                    {
                      alreadyRegisterDeatils.rounds?.map((round: Round,roundIndex: number) => (
                        <>
                          {
                            round.rooms.map((room: Room, roomIndex) => (
                                <button title={`Round-${roundIndex+1} Room-${roomIndex}`} className="bg-themePrimary hover:bg-themeDarkerAlt text-white px-4 py-2 rounded-md" onClick={() => copyToClipboard(room._id as string, room.accessToken as string)}>R{roundIndex+1}-R{roomIndex+1}</button>
                              
                            ))
                          }
                        </>
                      ))
                    }












                  </div>
                </div>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ marginTop: "5rem" }}>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        First Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Last Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      alreadyRegisterDeatils.participants?.map((user: any) => (
                        <tr className="odd:bg-white even:bg-gray-50 ">
                          <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white text-[18px] font-normal">
                            {user?.user?.fullName?.firstName}
                          </th>
                          <td className="px-6 py-4 text-[18px] font-normal">
                            {user?.user?.fullName?.lastName}
                          </td>
                          <td className="px-6 py-4 text-[18px] font-normal">
                            {user?.user?.email}
                          </td>
                          <td className="px-6 py-4 text-[18px] font-normal">
                            {user.status}
                          </td>
                        </tr>
                      ))
                    }

                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Page;
