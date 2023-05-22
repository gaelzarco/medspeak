import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai';
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  }
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
  if (!files.audioFile) return res.status(400).json({ error: "No audio file provided" })

  const audioFile = files.audioFile as formidable.File;

  const fileName = `${audioFile.newFilename}.mp3`;
  fs.writeFile(fileName, fs.readFileSync(audioFile.filepath), (err) => {
    if (err) return res.status(500).json({ error: err });
    console.log('File saved successfully:', fileName);
  });

  const response = await openai.createTranscription(
    fs.createReadStream(fileName) as any,
    "whisper-1"
  );

  if (response.status !== 200) return res.status(500).json({ error: response.statusText });
  else return res.status(200).json(response.data);
}
