"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import ScheduleMeet from "@/src/components/dashboard/job/ScheduleMeet";

export default function ScheduleMeetPage() {
  const { data, status } = useSession();
  const userData = data?.user as any;
  const isCandidate = userData?.role.isCandidate;

  return (
    <>
      <Head>
        <meta name="description" content="Schedule Meet" />
      </Head>

      <Layout>
        <main>
          {status === "unauthenticated" && <UserNotLogin />}
          {isCandidate && <UserGoBack />}
          {userData && status === "authenticated" && !isCandidate && (
            <ScheduleMeet/>
          )}
        </main>
      </Layout>
    </>
  );
}
