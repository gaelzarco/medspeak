import type { NextApiRequest, NextApiResponse } from 'next'
// import { Configuration, OpenAIApi } from 'openai';
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  }
}

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

function formidablePromise(req: NextApiRequest, opts?: Parameters<typeof formidable>[0]):
Promise<{fields: formidable.Fields; files: formidable.Files}> {
  return new Promise((accept, reject) => {
      const form = formidable(opts);

      form.parse(req, (err, fields, files) => {
          if (err) {
              return reject(err);
          }
          return accept({ fields, files });
      });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { files } = await formidablePromise(req);
  if (!files || !files.audioFile) return res.status(400).json({ error: "No audio file provided" })

  const audioFile = files.audioFile as unknown as File

  console.log(audioFile)

  const whisperURL = "https://api.openai.com/v1/audio/transcriptions";

  const headers = new Headers();
  headers.append(
    "Authorization",
    `Bearer ${process.env.OPENAI_API_KEY}`
  );
  headers.append(
    "Content-Type",
    "multipart/form-data"
  )
  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("model", "whisper-1");
    
  const response = await fetch(whisperURL, {
    method: "POST",
    headers: headers,
    body: formData
  })

  const data = await response.json()
  console.log(data.error.message)

  if (!data.ok) return res.status(400).json({ error: data.error.message });
  else return res.status(200).json({ data: data });
}
