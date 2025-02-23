"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import React from "react";
import Layout from "@/src/components/frontend/layout/index";
import PageTitle from "@/src/components/frontend/page-title/index";
import capitalize from "@/src/components/lib/capitalize";
import { useEffect, useRef } from "react"
import { ArrowRightIcon, BriefcaseIcon, CalendarIcon, UserIcon as UserGroupIcon } from "lucide-react"




const steps = [
    {
        icon: <UserGroupIcon className="h-6 w-6" />,
        title: "Create Your Profile",
        description: "Sign up and build your professional profile to showcase your skills and experience.",
    },
    {
        icon: <BriefcaseIcon className="h-6 w-6" />,
        title: "Explore Opportunities",
        description: "Browse through a wide range of job listings tailored to your preferences and qualifications.",
    },
    {
        icon: <CalendarIcon className="h-6 w-6" />,
        title: "Attend Weekly Events",
        description: "Participate in our career-boosting weekly events to network and enhance your skills.",
    },
]

const events = [
    {
        title: "Resume Writing Workshop",
        description: "Learn how to craft a compelling resume that stands out to employers.",
    },
    {
        title: "Industry Insights Webinar",
        description: "Gain valuable knowledge about trends and opportunities in various industries.",
    },
    {
        title: "Mock Interview Sessions",
        description: "Practice your interview skills with experienced professionals and receive feedback.",
    },
    {
        title: "Networking Mixer",
        description: "Connect with other job seekers and potential employers in a relaxed setting.",
    },
]



const Page = () => {


    return (
        <>
            <Head>
                <meta name="description" content={"How Its Work"} />
                <title>How Its Work</title>
            </Head>

            <Layout>
                <main className="bg-light ">
                    <PageTitle title={"How Its Work"} />
                    <div className=" bg-gray-50 py-10 px-8">
                    
                        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                
                                <p className="text-xl text-gray-600">Discover how our job portal and weekly events can boost your career</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                {steps.map((step, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                                        <div className="bg-blue-500 text-white rounded-full p-3 mb-4">{step.icon}</div>
                                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                        <p className="text-gray-600 text-center">{step.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 rounded-lg p-8">
                                <h3 className="text-2xl font-bold text-center mb-6">Weekly Career Events</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {events.map((event, index) => (
                                        <div key={index} className="bg-white rounded-lg shadow p-6 flex items-start">
                                            <CalendarIcon className="text-blue-500 mr-4 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
                                                <p className="text-gray-600">{event.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center mt-16">
                                <a
                                    href="/login"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Get Started
                                    <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
                                </a>
                            </div>
                        </main>
                    </div>
                </main>
            </Layout>
        </>
    );
};

export default Page;

