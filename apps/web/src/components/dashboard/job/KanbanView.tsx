import React, { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr';
import { authAxios } from '../../utils/axiosKits';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';


interface Props {
  jobId: string;
}



const colors:{ [key: string]: string } = {
  a: "#ff5733", // Bright orange
  b: "#33a1ff", // Sky blue
  c: "#28a745", // Green
  d: "#ffc107", // Amber
  e: "#6f42c1", // Purple
  f: "#dc3545", // Red
  g: "#20c997", // Teal
  h: "#fd7e14", // Vibrant orange
  i: "#6610f2", // Deep purple
  j: "#17a2b8", // Cyan
  k: "#e83e8c", // Pink
  l: "#007bff", // Blue
  m: "#28a745", // Green
  n: "#20c997", // Yellow
  o: "#343a40", // Dark gray
  p: "#ffb400", // Slate gray
  q: "#6c757d", // Light gray
  r: "#dc3545", // Neutral gray
  s: "#28a745", // Coral
  t: "#ffb400", // Sunflower
  u: "#39a9db", // Soft blue
  v: "#4caf50", // Light green
  w: "#f50057", // Magenta
  x: "#9c27b0", // Violet
  y: "#ff9800", // Warm orange
  z: "#607d8b", // Muted blue-gray
  default: "#607d8b", // Muted blue-gray
};



export const getColorByFirstLetter = (name: string): string => {
  if (!name) return colors.default as string;

  const firstLetter = (name[0] as string).toLowerCase();

  // Return color if the letter exists, fallback to default
  return colors[firstLetter] || colors.default as string;
};

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const KanbanView: FC<Props> = ({ jobId }) => {
  const [loading, setLoading] = useState(false);
  const { data, error, mutate } = useSWR(
    jobId ? `/jobs/apply/job/${jobId}` : null,
    fetcher
  );

  const states = useMemo(() => data?.jobData?.states || [], [data]);
  const applications = useMemo(() => data?.applications || [], [data]);


  const getGridColumns = (length: number) => {
    if (length <= 4) return "grid-cols-4";
    else if (length === 5) return "grid-cols-5";
    else if (length === 6) return "grid-cols-6";
    else if (length === 7) return "grid-cols-7";
    else if (length === 9) return "grid-cols-9";
    else if (length === 10) return "grid-cols-10";
    else if (length >= 12) return "grid-cols-12";
    else return "grid-cols-4"; // Default fallback
  };


  const updateApplicationStatus = async (status: any, _id: string) => {
    console.log(status, "v")
    setLoading(true);
    try {
      await authAxios({
        method: "PUT",
        url: `/jobs/apply/job/${_id}`,
        data: { status },
      }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message)
          mutate(`/jobs/apply/job/${jobId}`).then(() => {
            setLoading(false);
          });
        }
      });
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        setLoading(false);
      } else {
        toast.error(error.message);
        setLoading(false);
      }
    }
  };


  const handleDrop = useCallback(async (event: any, state: string) => {
    const application_id = event.dataTransfer.getData("application_id");
    updateApplicationStatus(state, application_id);
  }, [jobId]);


  const onDragStart = useCallback((event: any, application_id: string) => {
    event.dataTransfer.setData("application_id", application_id);
  }, []);

  return (
    <>
      {loading && <div className='px-5'><div className="w-full h-1 bg-themePrimary rounded-full animate-move-stick my-4"></div></div>}


      {
        <div className={`relative min-h-[60vh] grid gap-4 ${getGridColumns(states.length)}`}>
          {
            states && states.map((state: string) => (
              <div className='h-full bg-grayLight/10 rounded-md shadow-md ' onDrop={(e) => handleDrop(e, state)} onDragOver={(e) => e.preventDefault()}>
                <h1 className={`capitalize text-lg text-center p-2 rounded-t-md text-white`} style={{background: `${getColorByFirstLetter(state)}`}}>{state}</h1>
                <div className='mt-4 space-y-5 p-2'>
                  {
                    applications && applications.filter((application: any) => application.status == state).map((application: any) => (
                      <div className='bg-white p-2 shadow-md rounded-md cursor-pointer space-y-5 flex flex-col justify-center items-center' draggable onDragStart={(e) => onDragStart(e, application._id)}>
                        <div className='flex items-center gap-0 flex-col'>
                          <Image
                            className="rounded-full object-cover object-right p-1 border border-solid border-gray-500"
                            src={`https://ui-avatars.com/api/?name=${application?.fullName}&size=300&background=random&color=white`}
                            alt="User image"
                            width={60}
                            height={60}
                            quality={75}
                            priority={true}
                          />
                          <h3 className='text-lg'>{application.fullName}</h3>
                          <h3 className='text-xxs opacity-40'>{application.status}</h3>
                        </div>

                        <a href={application.cvFile} target='_blank' className='text-themePrimary' style={{ marginTop: '2px' }}>
                          View CV
                        </a>


                        <div className='space-y-1'>
                          <button className="!py-2 px-2 bg-themePrimary rounded-lg shadow-themePrimary text-white flex-1 block w-full">
                            <Link href={`/job/hire/${application.user}?jobid=${jobId}&name=${application.fullName}&position=${data?.jobData?.jobTitle}`}>
                              Hire
                            </Link>
                          </button>
                          <button className="!py-2 px-2 bg-themePrimary rounded-lg shadow-themePrimary text-white flex-1 block w-full">
                            <Link href={`/job/schedule-meet/${application.user}?jobid=${jobId}`}>
                              Schedule Meet
                            </Link>
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      }
    </>
  )
}

export default KanbanView