// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTranscript } from '@/utils/openai'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = req.body

  const title = form.title as string
  const audioFile = form.recording as File

  console.log(title)

  const transcript = await getTranscript(audioFile)  

  res.send({ transcript })
}
