"use client";
import { authenticate, getConversations } from "@/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [allVideos, setAllVideos] = useState([]);
  const router = useRouter();
  const authenticateFunc = async () => {
    try {
      const res = await authenticate();
      localStorage.setItem("x-auth-token", res.data.token);
      alert("Authenticated");
    } catch (err) {
      console.log(err);
    }
  };
  const getAllVideos = async () => {
    try {
      const res = await getConversations();
      setAllVideos(res.data.videos);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    setIsToken(localStorage.getItem("x-auth-token"));
  }, [localStorage.getItem("x-auth-token")]);
  return (
    <div>
      {!isToken ? (
        <button onClick={authenticateFunc}>Authenticate</button>
      ) : (
        <div className="flex justify-center p-10 flex-col gap-2">
          <div className="flex justify-center gap-4">
            <button
              onClick={getAllVideos}
              className="border border-slate-700 p-4 "
            >
              {" "}
              get all videos{" "}
            </button>
            <button
              onClick={() => router.push("/video/upload")}
              className="border border-slate-700 p-4 "
            >
              add video
            </button>
          </div>
          <div className="flex flex-col p-4 gap-2">
            {allVideos?.map((video) => {
              return (
                <div
                  className="border border-slate-700 p-4"
                  onClick={() => router.push(`/video/${video?.id}`)}
                >
                  <h1 className=" text-lg">{video?.name}</h1>
                  <p className="text-slate-500">Video type : {video?.type}</p>
                  <p className="text-slate-500">
                    {video?.members.length !== 0 &&
                      `Members in video : ${video?.members.length}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
