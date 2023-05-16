import { type FormEvent, useState, useRef } from 'react'
import type { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { MagicWandIcon, CircleIcon } from '@radix-ui/react-icons'

type DocForm = {
    title: string
    recording: File | null
}

export default function NewDoc() {
    const [ docForm, setDocForm ] = useState<DocForm>({
        title: '',
        recording: null
    })
    const [ recording, setRecording ] = useState(false)
    const audioRef = useRef<File>();
    const audioRecorder = useAudioRecorder()

    const addAudioElement = (blob: any) => {
        const audioFIle = new File([blob], 'recording.mp3', {
            type: 'audio/mp3'
        })
        audioRef.current = audioFIle
        return audioFIle
    }

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
                <p className='text-sm'>This is where the magic happens. Simply provide a title for this document and begin recording the conversation between you and a patient. We use OpenAI's Whisper API to generate a transcript of the conversaiton. When you are done, just hit the record button again and make sure to include a title. Then, make sure you review the new document and finally, submit 🚀</p>
            </div>

            <form className='flex flex-col justify-between w-full' onSubmit={mutation.mutate}>
                <div className='flex flex-row w-full'>
                    <input 
                        name='docTitle'
                        type='text'
                        placeholder='Document Title'
                        className='bg-transparent border border-neutral-700 hover:border-neutral-600 rounded-lg w-full mr-2 h-10 px-5 text-sm outline-none'
                        onChange={(event) => {
                            setDocForm({ ...docForm, title: event.target.value })
                        }}
                    />
                    <button className="text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 mr-2 rounded-lg" onClick={(event) => {
                        event.preventDefault()
                        if (recording) {
                            audioRecorder.stopRecording()
                            let audioFile = addAudioElement(audioRecorder.recordingBlob)
                            setDocForm({ ...docForm, recording: audioFile })
                        }
                        else audioRecorder.startRecording()
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
                </div>

                {docForm.recording && docForm.title && (
                    <div className='border border-neutral-700 mt-10 mx-44 p-4 rounded-xl'>
                        <div className='flex flex-row justify-between items-center p-2'>
                            <h1 className='text-lg font-bold text-green-400'>Recording Complete</h1>
                            <p className='text-sm text-neutral-500'>Your recording is complete. Review and submit</p>
                        </div>

                        <div className='p-2'>
                            <h1 className='text-md'>Document Title</h1>
                            <p className='text-sm text-neutral-500'>{docForm.title}</p>
                        </div>

                        <div className='flex flex-row justify-between p-2 items-center'>
                            <div className='block'>
                                <h1 className='text-md'>Recording</h1>
                                <p className='text-sm text-neutral-500'>{docForm.recording.name}</p>
                            </div>
                            <div className='inline-flex items-center'>
                                <audio src={URL.createObjectURL(docForm.recording)} controls className='ml-8 rounded-md'></audio>
                            </div>
                        </div>
                    </div>
                )}
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