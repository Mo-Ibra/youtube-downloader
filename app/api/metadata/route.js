import { exec } from "child_process";

export async function POST(req) {
  const { url } = await req.json();

  if (!url || !url.startsWith("http")) {
    return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), {
      status: 400,
    });
  }

  try {
    const command = `python -m yt_dlp --skip-download --print-json ${url}`;
    const metadata = await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${stderr}`);
          reject(new Error("Failed to fetch metadata"));
        }
        resolve(JSON.parse(stdout));
      });
    });

    return new Response(
      JSON.stringify({
        thumbnail: metadata.thumbnail,
        title: metadata.title,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch metadata" }), {
      status: 500,
    });
  }
}