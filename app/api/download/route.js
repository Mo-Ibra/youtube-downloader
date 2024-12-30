import path from "path";
import { exec } from "child_process";

export async function POST(req) {
  const { url, format } = await req.json();

  if (!url || !url.startsWith("https")) {
    return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), {
      status: 400,
    });
  }

  if (!["mp3", "mp4"].includes(format)) {
    return new Response(
      JSON.stringify({ error: "Invalid format. Use mp3 or mp4" }),
      { status: 400 }
    );
  }

  try {
    const videoName = `${Date.now()}_video.${format}`;
    const outputPath = path.resolve("./public/downloads", videoName);

    // Command
    const command =
      format === "mp3"
        ? `python -m yt_dlp -x --audio-format mp3 -o "${outputPath}" ${url}`
        : `python -m yt_dlp -o "${outputPath}" ${url}`;

    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${stderr}`);
          reject(new Error("Download failed"));
        }
        console.log(stdout);
        resolve();
      });
    });

    return new Response(
      JSON.stringify({ message: "Download complete", filePath: videoName }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  }
}
