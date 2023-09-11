"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getConversation } from "@/api/axios";
import {
  CalendarIcon,
  ClockIcon,
  CounterClockwiseClockIcon,
} from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";

const BookingConfirmation = () => {
  const [videoData, setVideoData] = useState({});

  const [loading, setLoading] = useState(true);
  const route = usePathname();
  const router = useRouter();
  const {
    questions,
    summary,
    transcript,
    video,
    analytics,
    actionitems,
    followups,
    topics,
    trackers,
  } = videoData;

  function getDuration(transcript) {
    // Extract all timestamp patterns
    const timestampPatterns = transcript?.match(
      /\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/g
    );

    // Exit early if no patterns are found
    if (!timestampPatterns) return "";

    // Get the end timestamp of the last subtitle
    const lastTimestamp = timestampPatterns[timestampPatterns.length - 1];
    const endTimestamp = lastTimestamp.split(" --> ")[1];

    // Extract hours, minutes, seconds, and milliseconds
    const [hours, minutes, seconds, milliseconds] = endTimestamp
      .split(/[:,]/)
      .map(Number);

    // Calculate total milliseconds
    const totalMilliseconds =
      hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;

    // Convert milliseconds to hr, min, sec format
    const hoursResult = Math.floor(totalMilliseconds / 3600000);
    const remainderAfterHours = totalMilliseconds % 3600000;
    const minutesResult = Math.floor(remainderAfterHours / 60000);
    const remainderAfterMinutes = remainderAfterHours % 60000;
    const secondsResult = Math.floor(remainderAfterMinutes / 1000);

    let result = "";
    if (hoursResult) {
      result += `${hoursResult}hr `;
    }
    if (minutesResult) {
      result += `${minutesResult}m `;
    }
    if (secondsResult) {
      result += `${secondsResult}s`;
    }

    return result.trim();
  }
  const getVideo = async () => {
    try {
      const res = await getConversation(route.split("/")[2]);
      console.log(res);
      setVideoData({ ...res.data });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    getVideo();
  }, []);

  return loading ? (
    <div
      className="w-screen h-screen flex flex-col gap-4 justify-center align-center items-center"
      role="status"
    >
      <svg
        aria-hidden="true"
        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
      <p className="text-slate-500">This might take a while. Please wait...</p>
    </div>
  ) : (
    <div className="flex p-10 flex-col bg-blue-100 min-h-[100vh]">
      <div className="bg-white rounded-xl p-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-slate-400 h-[400px] w-[100%] rounded-md"></div>
          <div>
            <h1 className="text-3xl mt-2 font-medium">{video?.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex gap-2">
                <CalendarIcon color="purple" width={24} height={24} />
                <p className="text-slate-500">
                  {format(parseISO(video?.startTime), "dd MMMM yyyy")}
                </p>
              </div>
              <div className=" bg-slate-300 w-2 h-2 rounded-full"></div>

              <div className="flex gap-2">
                <ClockIcon color="purple" width={24} height={24} />

                <p className="text-slate-500">
                  {format(parseISO(video?.startTime), "h:mm aa")}
                </p>
              </div>
              <div className=" bg-slate-300 w-2 h-2 rounded-full"></div>

              <div className="flex gap-2">
                <CounterClockwiseClockIcon
                  color="purple"
                  width={24}
                  height={24}
                />

                <p className="text-slate-500">{getDuration(transcript)}</p>
              </div>
              <div className=" bg-slate-300 w-2 h-2 rounded-full"></div>

              <p className="text-slate-500">Sales Call</p>
              <div className=" bg-slate-300 w-2 h-2 rounded-full"></div>

              <div className="flex -space-x-1 overflow-hidden border border-slate-400 rounded-3xl p-2">
                {video.members.map(() => {
                  return (
                    <div className="h-6 w-6 rounded-full ring-2 bg-slate-500 flex items-center justify-center text-white ring-white">
                      {
                        ["A", "B", "C", "D", "E", "F", "G"][
                          Math.floor(Math.random() * 7)
                        ]
                      }
                    </div>
                  );
                })}
                <p className="text-slate-500 pl-4">
                  {video.members.length} Attendees
                </p>
              </div>
            </div>
            <h1 className="text-2xl font-medium mt-4 mb-4">Overview</h1>
            {summary.map((s) => {
              return <p className="text-slate-500">{s?.text}</p>;
            })}
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Silence
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {Math.floor(
                    analytics.metrics.filter(
                      (e) => e.type == "total_silence"
                    )[0].percent
                  )}
                  %
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Talktime
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {Math.floor(
                    analytics.metrics.filter(
                      (e) => e.type == "total_talk_time"
                    )[0].percent
                  )}
                  %
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Talk Ratio
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {Math.floor(
                    (analytics.metrics.filter(
                      (e) => e.type == "total_talk_time"
                    )[0].percent /
                      (analytics.metrics.filter(
                        (e) => e.type == "total_silence"
                      )[0].percent +
                        analytics.metrics.filter(
                          (e) => e.type == "total_talk_time"
                        )[0].percent)) *
                      100
                  )}
                  %
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Questions Asked
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {questions.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <Tabs
          transcript={transcript}
          trackers={trackers}
          questions={questions}
          actionitems={actionitems}
        />
      </div>
    </div>
  );
};

export default BookingConfirmation;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Tabs = ({ transcript, trackers, questions, actionitems }) => {
  function timeToSeconds(time) {
    const [hh, mm, ssms] = time.split(":");
    const [ss, ms] = ssms.split(",");

    const totalMinutes = parseInt(hh, 10) * 60 + parseInt(mm, 10);
    return `${totalMinutes}:${ss}`;
  }
  function SubtitleEntry({ entry }) {
    const startInSeconds = timeToSeconds(entry.start);
    const endInSeconds = timeToSeconds(entry.end);
    return (
      <div className="border p-4 my-2">
        <div className="text-xs mb-2">
          {startInSeconds} : {endInSeconds}
        </div>
        <div>{entry.text}</div>
      </div>
    );
  }
  function parseSRT(data) {
    return data.split("\n\n").map((entry) => {
      const [index, time, ...text] = entry.split("\n");
      const [start, end] = time.split(" --> ");
      return { index, start, end, text: text.join(" ") };
    });
  }
  const [tabs, setTabs] = useState([
    {
      name: "Transcription",
      href: "#",
      count: "52",
      current: false,
      component: (
        <div className="container mx-auto p-4">
          {parseSRT(transcript).map((entry) => (
            <SubtitleEntry key={entry.index} entry={entry} />
          ))}
        </div>
      ),
    },
    {
      name: "Trackers",
      href: "#",
      count: "6",
      current: true,
      component: (
        <div>
          <h1 className="mt-2 font-medium">
            They helps you track must-have terms/phrases and the frequency of
            those tags.{" "}
          </h1>
          <div className="flex gap-4 mt-4">
            {trackers.map((t) => {
              return (
                <button
                  type="button"
                  className="inline-flex capitalize items-center gap-x-2 rounded-md border-2 border-indigo-600 text-indigo-600 px-3.5 py-2.5 text-sm font-semibold shadow-sm "
                >
                  {t.name.replace("Symbl.", "")}
                  <div className="rounded-full bg-indigo-600 text-white ml-2 px-4 py-1">
                    {t.matches[0].messageRefs.length}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      name: "Questions",
      href: "#",
      count: "4",
      current: false,
      component: (
        <div>
          <div className="max-w-2xl mt-6 mr-auto">
            {questions.map((question) => (
              <div
                key={question.id}
                className="mb-6 border border-gray-200 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="text-md font-bold">{question.text}</div>
                  <div className="rounded-full bg-indigo-600 text-white ml-2 px-4 py-1">
                    {Math.round(question.score * 100)}%
                  </div>
                </div>
                <div className="text-gray-500 font-medium mt-2">
                  Asked by: {question.from.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      name: "Action Items",
      href: "#",
      count: "4",
      current: false,
      component: (
        <div>
          <h1 className="mt-2 font-medium">
            They helps you next steps you can take after the call
          </h1>

          <div className="max-w-2xl mt-6 mr-auto">
            {actionitems.actionItems.map((action) => (
              <div
                key={action.id}
                className="mb-6 border border-gray-200 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="text-md font-bold">{action.text}</div>
                  <div className="rounded-full bg-indigo-600 text-white ml-2 px-4 py-1">
                    {Math.round(action.score * 100)}%
                  </div>
                </div>
                <div className="text-gray-500 font-medium mt-2">
                  Type {action.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]);
  console.log(tabs);
  return (
    <div className="tabs mt-8">
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href="#"
                onClick={() =>
                  setTabs(
                    tabs.map((t) =>
                      t.name === tab.name
                        ? { ...t, current: true }
                        : { ...t, current: false }
                    )
                  )
                }
                className={classNames(
                  tab.current
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                  "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="py-6 h-[100%]">
        {" "}
        {tabs.find((tab) => tab.current).component}
      </div>
    </div>
  );
};
