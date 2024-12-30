"use client";

import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [metadata, setMetaData] = useState(null);

  const fetchMetaData = async () => {
    console.log("Fetching meta data");
    setLoading(true);

    try {
      const response = await fetch("api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.error) {
        setStatus(data.error);
        return;
      }

      if (response.ok) {
        console.log(data);
        setMetaData(data);
        setStatus("");
      }
    } catch (err) {
      setStatus("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async (format) => {
    console.log("Download clicked");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format }),
      });

      const data = await response.json();

      if (data.error) {
        setStatus(`Error: ${data.error}`);
        return;
      }

      if (response.ok) {
        setStatus(`Download successful! File: ${data.filePath}`);
        console.log(data.message);
      } else {
        setStatus(`Error: ${data.error}`);
      }

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center dark">
      <h1 className="text-4xl font-bold text-orange-500 mb-8">
        YouTube Downloader
      </h1>
      <div className="flex items-center space-x-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2 rounded-l-md text-black"
        />
        <button
          onClick={fetchMetaData}
          className="bg-orange-500 text-white px-6 py-2 rounded-r-md hover:bg-orange-600 transition"
        >
          Download
        </button>
      </div>

      {loading && (
        <div className="m-4">
          <LoadingSpinner />
        </div>
      )}

      {metadata && (
        <div className="mt-8 text-center">
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            className="w-64 mx-auto"
          />
          <h2 className="text-2xl mt-4">{metadata.title}</h2>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => downloadVideo("mp4")}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Download MP4
            </button>
            <button
              onClick={() => downloadVideo("mp3")}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
            >
              Download MP3
            </button>
          </div>
        </div>
      )}

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default Home;
