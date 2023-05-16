// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTranscript } from '@/utils/openai'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = req.body
  console.log(form)
  // const transcript = await getTranscript(audioFile)  

  // res.send({ transcript })
}
