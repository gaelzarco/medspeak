import { type FormEvent, useState } from 'react'
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
    const audioRecorder = useAudioRecorder()
    const [ docForm, setDocForm ] = useState<DocForm>({
        title: '',
        recording: null
    })

    const addRecording = (blob: Blob) => {
        const audioFile = new File([blob], 'recording.mp3', { type: 'file' })
        
        setDocForm({ ...docForm, recording: audioFile })
    }

    const mutation = useMutation({
        mutationFn: (event: FormEvent) => {
            event.preventDefault()
            let formData = new FormData()
            formData.set('title', docForm.title)
            formData.set('recording', docForm.recording as File)
            return fetch('/api/whisper', {
                method: 'POST',
                body: formData
            })
        }
    })

    console.log(docForm)

     return (
        <div className="flex flex-col w-full max-w-7xl p-5">
            <div className='w-full mb-10 px-2'>
                <h1 className='mb-4 text-lg font-bold'>Explanation</h1>
                <p className='text-sm'>This is where the magic happens. Simply provide a title for this document and begin recording the conversation between you and a patient. We use OpenAI&apos;s Whisper API to generate a transcript of the conversaiton. When you are done, just hit the record button again and make sure to include a title. Then, make sure you review the new document and finally, submit 🚀</p>
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
                    {!audioRecorder.isRecording ? (
                        <button
                        className="text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg"
                        onClick={(event) => {
                            event.preventDefault()
                            audioRecorder.startRecording()
                        }}
                        >
                            Begin Recording
                            <MagicWandIcon className='ml-2 text-green-500' />
                        </button>
                    ) : (
                        <button 
                        className="text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg"
                        onClick={(event) => {
                            event.preventDefault()
                            audioRecorder.stopRecording()
                            audioRecorder.recordingBlob && addRecording(audioRecorder.recordingBlob)
                        }}>
                            Stop Recording
                            <CircleIcon className='ml-2 text-red-500 bg-red-500 rounded-full animate-pulse' />
                        </button>
                    )}
                </div>

                {audioRecorder.recordingBlob && docForm.title && (
                    <div className='border border-neutral-700 mt-10 mx-auto w-full p-10 rounded-xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='text-lg font-bold text-green-400'>Recording Complete</h1>
                            <p className='text-sm text-neutral-500'>Your recording is complete. Review and submit</p>
                        </div>

                        <div className='mt-4 p-2'>
                            <h1 className='text-md'>Document Title</h1>
                            <p className='text-sm text-neutral-500'>{docForm.title}</p>
                        </div>

                        <div className='flex flex-row justify-between mt-4 p-2 items-center'>
                            <div className='block'>
                                <h1 className='text-md'>Recording</h1>
                                <p className='text-sm text-neutral-500'>{audioRecorder.recordingBlob.name}</p>
                            </div>
                            <div className='inline-flex items-center'>
                                <audio src={URL.createObjectURL(audioRecorder.recordingBlob)} controls className='ml-8 rounded-md'></audio>
                            </div>
                        </div>

                        <div className='w-full flex mt-4'>
                            <button className='mx-auto text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg' type='submit'>
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </form>

            {audioRecorder.isRecording && (
                <div className='flex flex-col items-center w-full mt-10'>
                    <h1 className='mb-4 text-lg font-bold text-red-500 animate-pulse'>Recording</h1>
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