"use client";
import { format, isSameDay } from "date-fns";
import { useState } from "react";
import useSWR from "swr";


// TODO: Change baseurl depending on port
const fetcher = (url, ...params) =>
    fetch(`http://localhost:3001${url}`, ...params).then((res) => res.json())

const IncompleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mx-auto text-[#A2A2A2]">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mx-auto text-[#6442EF]">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
)

const TodayIcon = () => (
    <div className="size-6 bg-[#6442EF] rounded-full mx-auto" />
)

const HandleIcon = ({ state, date }) => {
    const CURR_DATE = new Date();
    const isMatch = isSameDay(new Date(date), CURR_DATE)

    if (isMatch && state === 'INCOMPLETE') return <TodayIcon />

    switch(state ) {
        case 'COMPLETED':
        case 'SAVED':
        case 'AT_RISK':
            return <CheckIcon />
        case 'INCOMPLETE':
        default:
            return <IncompleteIcon />
    }
}

const HomePage = () => {
    const [streakId, setStreakId] = useState(1);

    const { data } = useSWR(`/streaks/${streakId}`, fetcher)

    const handleNext = () => setStreakId(streakId < 5 ? streakId + 1 : 1);

    const handlePrev = () => setStreakId(streakId > 1 ? streakId - 1 : 5);

    const renderStreakData = data && (
        <div className="max-w-4xl">
            <h1 className="text-center mb-5 text-4xl">
                Your streak is {data.total} {data.total > 1 ? 'days' : 'day'}
            </h1>
            {/* <TodayIcon /> */}
            <ul className="flex items-center justify-center space-x-3 bg-white p-5 rounded-md text-[#6442EF] mb-3">
                {data.days.toReversed().map((d, i) => (
                    <li key={i} className="text-center">
                        <HandleIcon state={d.state} date={d.date} />
                        <p className="text-sm font-bold">{format(new Date(d.date), 'MMM dd')}</p>
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-between text-sm">
                <button className="rounded-md px-6 py-1 text-white bg-[#6442EF] cursor-pointer" onClick={handlePrev}>
                    Prev
                </button>
                <button className="rounded-md px-6 py-1 text-white bg-[#6442EF] cursor-pointer" onClick={handleNext}>
                    Next
                </button>
            </div>
        </div>
    )

    return (
        <div className="bg-[url(/images/BG.png)] flex min-h-screen justify-center items-center">
            {data ? renderStreakData : <h1>Fetching...</h1>}
        </div >
    )
};

export default HomePage;