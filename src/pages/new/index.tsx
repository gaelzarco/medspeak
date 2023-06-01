import { type FormEvent, useState } from 'react'
import type { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { CrumpledPaperIcon } from '@radix-ui/react-icons'
import { DotWave } from '@uiball/loaders'
import { motion } from 'framer-motion'

export default function NewDoc() {
  const [ parent ] = useAutoAnimate()

  const [ title, setTitle ] = useState<string | null>(null)
  const [ audioFile, setAudioFile ] = useState<Blob | null>(null)
  const [ transcript, setTranscript ] = useState<string | null>(null)
  const [ loading, setLoading ] = useState<boolean>(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) setAudioFile(file);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const documentTitle = event.target.value && event.target.value
    if (documentTitle) setTitle(documentTitle);
};

  const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      setTranscript(null);
      setLoading(true);
    
      if (!audioFile) throw new Error('No audio file found');
      if (!title) throw new Error('No title found');
    
      const formData = new FormData();
      formData.append('audioFile', audioFile);
      formData.append('title', title);
    
      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });
    
      const data = await response.json();

      setAudioFile(null);
      setTitle(null);
    
      if (response.ok) {
        setLoading(false);
        setTranscript(data.text);
      } else {
        console.log(data);
      }
    };

    return (
      <motion.div ref={parent} className="flex flex-col w-full max-w-7xl p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
          <div className='w-full rounded-xl p-5'>
              <h1 className='text-xl font-bold'>Create New Document</h1>
              <p className='text-sm mt-2 text-neutral-400'>Here is where your journey begins. Provide an audio file of your conversation with patients and let MedSpeak handle the rest. We create a transcript of your conversation and highlight important medical information so you don't have to. Afterwards, you can review and save.</p>
          </div>

          {loading && (
            <div className='flex flex-col w-full mt-20'>
                <div className='flex flex-col items-center w-full px-2 mb-4 content-center justify-center'>
                    <DotWave color='white' size={25}/>
                    <p className='text-neutral-400 mt-2'>Processing</p>
                </div>
              </div>
          )}

          {!transcript && !loading && (
            <form className='flex flex-col justify-between w-full mt-8 border border-neutral-700 rounded-xl p-5' encType='multipart/form-data' onSubmit={handleSubmit}>
              <div className='w-full mb-4 px-2'>
                <label className=' text-lg font-semibold' htmlFor='title'>Title</label>
                <input 
                  name='title'
                  type='text'
                  placeholder='Miyagi - 01/25/2023'
                  onChange={handleTitleChange}
                  className='w-full bg-transparent text-sm inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 py-2 px-4 rounded-lg focus-within:outline-none mt-2'
                />
              </div>

            <div className='flex flex-col w-full px-2 mb-4 mt-5'>
              <label className=' text-lg font-semibold' htmlFor='audio'>Upload Audio</label>
              <p className='text-sm mt-2 text-neutral-400'>Provide an .mp3 or .wav file and let MedSpeak handle the rest. We use OpenAI's Whisper API to create a transcript of the conversation between you and your partient. </p>
            </div>
  
              <div className='flex flex-row justify-between items-center px-2'>
                <div className='flex flex-row items-center'>
                  <input
                    name='audio'
                    type='file'
                    accept='audio/*'
                    onChange={handleFileChange}
                    className="text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg"
                  />

                  {audioFile && !loading && !transcript && (              
                    <audio controls className='ml-4 rounded-md'>
                      <source src={URL.createObjectURL(audioFile)} />
                    </audio>
                  )}
                </div>
  
                {audioFile && title && !loading && !transcript && (
                  <button 
                    className='text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg' 
                    type='submit'>
                        Generate
                  </button>
                )}
              </div>
            </form>
          )}

          {transcript && (
            <div className='flex flex-col w-full mt-10 p-5 border border-neutral-700 rounded-xl'>
              <div className='flex flex-row items-center w-full px-2 justify-between'>
                <div  className='flex flex-row items-center'>
                  <h1 className='text-lg font-semibold'>Transcript</h1>
                </div>

                <div className='flex flex-row items-center'>
                  <button 
                    className='text-sm h-min inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[200px] py-2 px-4 rounded-lg'
                    onClick={() => {
                      setAudioFile(null)
                      setTranscript(null)
                    }}
                  >
                    Try again
                    <CrumpledPaperIcon className='ml-5 text-red-400'/>
                  </button>
                </div>
              </div>

              <div className='flex flex-col w-full px-2 mt-5'>
                <p className='text-sm'>{transcript}</p>
              </div>
            </div>
          )}

      </motion.div>
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