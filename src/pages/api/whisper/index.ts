import type { NextApiRequest, NextApiResponse } from 'next'
import multiparty from "multiparty";
import { getTranscript } from '@/utils/openai'
import fs from 'fs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new multiparty.Form();
  const data = await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) reject({ err });
      resolve({ fields, files });
    });
  });
  console.log(`data: `, data);

  const audioFile = data.files.recording[0].path
  const audioData = fs.readFileSync(audioFile)
  const audioBase64 = Buffer.from(audioData).toString('base64')

  const transcript = await getTranscript(audioBase64)
  console.log(transcript)

  res.status(200).json({ success: true });
}

export const config = {
  api: {
    bodyParser: false
  }
}
