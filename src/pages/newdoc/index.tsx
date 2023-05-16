import { type FormEvent, useState } from 'react'
import type { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
// import { ProcessRecord } from 'react-nextjs-record'
// Possible form of recording audio

import { MagicWandIcon, CircleIcon } from '@radix-ui/react-icons'

type DocForm = {
    name: string
    recording: File | null
}

export default function NewDoc() {
    const [ docForm, setDocForm ] = useState<DocForm>({
        name: '',
        recording: null
    })

    const [ recording, setRecording ] = useState(false)

    const mutation = useMutation({
        mutationFn: (event: FormEvent) => {
            event.preventDefault()
            return fetch('/api/whisper', {
                method: 'POST',
                body: JSON.stringify(docForm)
            })
        }
    })

    return (
        <div className="flex flex-col w-full max-w-7xl p-5">
            <div className='w-full mb-10 px-2'>
                <h1 className='mb-4 text-lg font-bold'>Explanation</h1>
                <p className='text-sm'>This is where the magic happens. Simply provide a title for this document and begin recording the conversation between you and a patient. We use OpenAI's Whisper API to generate a transcription of the conversaiton. When you are done, just hit the record button again.</p>
            </div>

            <form className='flex flex-row justify-between w-full' onSubmit={mutation.mutate}>
                <input 
                    name='docTitle'
                    type='text'
                    placeholder='Document Title'
                    className='bg-transparent border border-neutral-700 hover:border-neutral-600 rounded-lg w-full mr-2 h-10 px-5 text-sm outline-none'
                    onChange={(event) => {
                        setDocForm({ ...docForm, name: event.target.value })
                    }}
                />
                <button className="text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 mr-2 rounded-lg" onClick={(event) => {
                    event.preventDefault()
                    setRecording(!recording)
                }}>
                    {!recording ? (
                        <>
                            Begin Recording
                            <MagicWandIcon className='ml-2 text-green-500' />
                        </>
                    ) : (
                        <>
                            Stop Recording
                            <CircleIcon className='ml-2 text-red-500 bg-red-500 rounded-full animate-pulse' />
                        </>
                    )}
                </button>
            </form>

            {recording && (
                <div className='flex flex-col items-center w-full mt-10'>
                    <h1 className='mb-4 text-lg font-bold text-red-500 animate-pulse'>Recording</h1>
                    <p className='text-sm text-neutral-500'>You are currently recording. When you are done, just hit the record button again.</p>
                </div>
            )}
        </div>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context)
  
    if (!session) {
      return {
        redirect: {
          destination: '/landing',
          permanent: false
        }
      }
    }
  
    return {
      props: { session }
    }
  }