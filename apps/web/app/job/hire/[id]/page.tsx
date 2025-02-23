"use client"
import { useSession } from "next-auth/react";
import Head from "next/head";
import MangeJobsList from "@/src/components/dashboard/job/manage-jobs-list";
import Layout from "@/src/components/dashboard/layout";
import { UserGoBack, UserNotLogin } from "@/src/components/lib/user";
import Hire from "@/src/components/dashboard/job/Hire";

export default function HirePage() {
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
            <Hire/>
          )}
        </main>
      </Layout>
    </>
  );
}
