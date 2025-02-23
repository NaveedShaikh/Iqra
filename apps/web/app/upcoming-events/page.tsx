"use client";
import _ from "lodash";
import Head from "next/head";
import React, { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Axios } from "@/src/components/utils/axiosKits";
import BlogItem from "@/src/components/frontend/blog/blog-item";
import Layout from "@/src/components/frontend/layout";
import PageTitle from "@/src/components/frontend/page-title";
import blogsDataPre from "@/src/data/blogData.json";
import EventCard from "@/src/components/frontend/event/event-card";
import { useFetch } from "@/src/hooks/useFetch";

const fetcher = (url: string) => Axios(url).then((res) => res.data.data);

export default function CareerAdvice() {
    // const { data, error } = useSWR("/events/upcoming", fetcher, {
    //     dedupingInterval: 0
    // });

    const {data, error } = useFetch("/api/v1/events/upcoming");

    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Upcoming Events "
                />
            </Head>

            <Layout>
                <main className="bg-grey">
                    <PageTitle title="Upcoming Events" />
                    <section className="py-16 md:py-20 lg:py-24 bg-white">
                        <div className="container">
                            <div className="grid gap-4 xl:gap-6 xl:grid-cols-3 md:grid-cols-2">
                                {_.map(data, (item, index) => (
                                    <EventCard event={item} key={index} />
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </Layout >
        </>
    );
}
