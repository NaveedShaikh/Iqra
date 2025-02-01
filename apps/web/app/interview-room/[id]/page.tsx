'use client';
import { registerOnOpportunityRequest, verifiedInterviewerRequest } from '@/http/event';
import { authAxios } from '@/src/components/utils/axiosKits';
import { useQue } from '@/src/context/QueContent';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { JitsiMeeting } from "@jitsi/react-sdk"
import useSWR from 'swr';
import RoomSidebar from '@/ui/header/room-sidebar';
import InterviewFeedbackModal from '@/src/components/interview/live-interview-feedback';
import { QueEvent } from '@/src/constant/QueEventConstant';

const fetcher = (url: string) => authAxios(url).then((res) => res.data.data);
const page = ({ params }: { params: { id: string } }) => {
  const YOUR_DOMAIN: string = "meet.hgsingalong.com"
  const serachParams = useSearchParams();
  const token = serachParams.get('accessToken');


  const [isVerified, setIsVerified] = useState<undefined | true>(undefined);
  const [interviewer, setInterviewer] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<undefined | any>(undefined);
  const [currentUserId, setCurrentUserId] = useState<undefined | string>(undefined);
  const [queCount,setQueCount] = useState(-1);
  const [isJoined, setIsJoined] = useState(false);
  const [feedbackOpen,setFeedBackOpen] = useState(false);

 
  const { data, error } = useSWR(`/events/get-round-by-room-id/${params.id}`, fetcher);
  const { data: userData, status } = useSession();
  const user: any = userData?.user;

  const { handleNextParticipant, handleGetCurrentRoomUser, handleAddInQue, socketRef } = useQue();
  const router = useRouter();


  const handleQueUpdate = useCallback((data:any) => {
    setQueCount(data.queLength);
  },[]);

  useEffect(() => {
    if(data?.round?._id){
      setTimeout(() => {
        console.log("calling...",data?.round?._id)
        socketRef.current?.emit(QueEvent.ROUND_JOIN,{id: data?.round?._id})
        socketRef.current?.on(QueEvent.UPDATE_QUE,handleQueUpdate)
      },1000);
    }

    return () => {
      socketRef.current?.off(QueEvent.UPDATE_QUE,handleQueUpdate)
    }
  },[data]);



  //get current interview user
  useEffect(() => {
    if (status !== "loading" && data) {
     setTimeout(() => {
      handleGetCurrentRoomUser({
        room_id: params.id,
        round_id: data.round._id,
      }, setCurrentUserId,setQueCount,setCurrentUser);
     },1000);
    }
  }, [params.id, status,data]);

  //verify user
  useEffect(() => {
    if (!token && status == 'unauthenticated') {
      router.push('/');
      return
    }

    if (!token && user && currentUserId !== undefined) {
      if (user._id.toString() != currentUserId?.toString()) {
        router.push('/');
      }
    }
  }, [status, token, user]);


  const handleVerifyToken = useCallback(async (token: string) => {
    try {
      const res = await verifiedInterviewerRequest({ room_id: params.id }, token);
      if (res.data.data.status !== "varified") {
        router.push('/');
        return;
      }
      setIsVerified(true);
      setInterviewer(res.data.data);
    } catch (error) {

      router.push('/');
    }
  }, [params.id]);

  //user effect verify interviewer
  useEffect(() => {
    if (token) {
      handleVerifyToken(token);
    }
  }, [token]);


  const handleNextClick = useCallback(() => {
    handleNextParticipant({
      round_id: data?.round?._id,
      room_id: params.id
    }, setCurrentUser,setQueCount);
  }, [data?.round, params.id]);

  const handlePassClick = useCallback(async () => {
    try {
      if(data.nextRound){
        handleAddInQue({
            oppotunity_id: data.nextRound?.opportunity_id,
            user_id: currentUser?.next_user_id,
            round_id: data.nextRound?._id,
            cuurent_room_id: params.id,
        });
        return;
      }


      handleAddInQue({
          only_remove: true,
          cuurent_room_id: params.id,
          pass_true: true,
          oppotunity_id: data.round?.opportunity_id,
          user_id: currentUser?.next_user_id
      });


      const formdata = {
          status: 'accepted',
          user_id: currentUser?.next_user_id,
      }

      await registerOnOpportunityRequest(formdata,data.round?.opportunity_id);
  } catch (error) {
      console.log((error as Error)?.message)
  }finally{
    setCurrentUser(undefined);
  }
  }, [data?.round, params.id,currentUser]);


 

  const handleRejectClick = useCallback(async () => {
    try {

      handleAddInQue({
          only_remove: true,
          cuurent_room_id: params.id,
          pass_true: false,
          oppotunity_id: data.round?.opportunity_id,
          user_id: currentUser?.next_user_id
      });


      const formdata = {
          status: 'rejected',
          user_id: currentUser?.next_user_id,
      }

      await registerOnOpportunityRequest(formdata,data.round?.opportunity_id);
  } catch (error) {
      console.log((error as Error)?.message)
  }finally{
    setCurrentUser(undefined);
  }
  }, [data?.round, params.id,currentUser]);

  return (
    <>
      {isJoined && token && <RoomSidebar setFeedBackOpen={setFeedBackOpen} onNext={handleNextClick} onPass={handlePassClick} onFail={handleRejectClick} isPassDisabled={!(currentUser && currentUser?.isEmpty == false)} queCount={queCount}/>}
      <InterviewFeedbackModal open={feedbackOpen} onReject={handleRejectClick} onPass={handlePassClick} onClose={() => setFeedBackOpen(false)}/>
      <div style={{ height: "100vh", display: 'grid', flexDirection: "column" }}>
        <JitsiMeeting
          domain={YOUR_DOMAIN}
          roomName={params.id || 'ishdjishdfiohdewhjroiehwoirh'}
          userInfo={{
            displayName: token ? interviewer?.name : user?.name,
            email: token ? interviewer?.email : user?.email
          }}

          interfaceConfigOverwrite={{
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,

          }}
          onApiReady={(externalApi) => {
            externalApi.addListener("videoConferenceLeft", () => {
              router.push("/?show_feedback=1");
            });

            externalApi.addListener('videoConferenceJoined', (event) => {
              setIsJoined(true);
            });
          }}

        />

      </div>
    </>
  )
}

export default page