import { type FormEvent, useState } from 'react'
import type { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { CheckIcon } from '@radix-ui/react-icons'

export default function NewDoc() {
    const [ audioFile, setAudioFile ] = useState<Blob | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setAudioFile(file);
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
      
        if (!audioFile) throw new Error('No audio file found');
      
        const formData = new FormData();
        formData.append('audioFile', audioFile);
      
        const response = await fetch('/api/whisper', {
          method: 'POST',
          body: formData,
        });
      
        const data = await response.json();
      
        if (data.success) {
          console.log(data);
        } else {
          console.log(data);
        }
      };

     return (
        <div className="flex flex-col w-full max-w-7xl p-5">
            <div className='w-full mb-10 px-2'>
                <h1 className='mb-4 text-lg font-bold'>Explanation</h1>
                <p className='text-sm'>This is where the magic happens. Simply provide a title for this document and begin recording the conversation between you and a patient. We use OpenAI&apos;s Whisper API to generate a transcript of the conversaiton. When you are done, just hit the record button again and make sure to include a title. Then, make sure you review the new document and finally, submit 🚀</p>
            </div>

            <div className='flex flex-row items-center w-full px-2 mb-5 text-lg font-bold'>
              <h1>Upload File</h1>
            </div>

            <form className='flex flex-col justify-between w-full' encType='multipart/form-data' onSubmit={handleSubmit}>
              {/* <div className='w-full mb-5'>
                <input 
                  type='text'
                  placeholder='Title'
                  className='w-full bg-transparent text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 py-2 px-4 rounded-lg'
                />
              </div> */}

              <div className='flex flex-row justify-between items-center'>
                <input
                  type='file'
                  accept='audio/*'
                  onChange={handleFileChange}
                  className="text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg"
                />

                <button 
                  className='text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg' 
                  type='submit'>
                      Submit
                </button>
              </div>
            </form>

            {audioFile && (
              <div className='flex flex-col w-full mt-10'>
                  <div className='flex flex-row items-center w-full px-2 mb-5 text-lg font-bold'>
                      <h1>Preview</h1>
                      <CheckIcon className='ml-5 text-green-500'/>
                  </div>
                
                  <audio controls className='w-full'>
                      <source src={URL.createObjectURL(audioFile)} />
                  </audio>
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