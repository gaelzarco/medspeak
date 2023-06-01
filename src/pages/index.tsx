import type { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { FilePlusIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

export default function Home() {  
  const router = useRouter()

  return (
    <main className='flex flex-col min-h-full w-full max-w-7xl p-5'>
      <div className='w-full p-5 pb-10'>
        <h1 className='text-xl font-bold'>Dashboard</h1>
      </div>
      
      <div className='flex justify-between w-[95%] mx-auto'>
        <motion.button className="flex flex-col justify-between text-left border border-neutral-700 min-w-[150px] w-[49%] p-5 rounded-xl"
          onClick={() => router.push('/new')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ borderColor: '#99ffcc' }}
          transition={{ duration: 0.5 }}
        >
          <FilePlusIcon className='mb-12 h-8 w-8'/>
          <div>
            <h3 className='text-md'>Generate Document</h3>
            <p className='leading-10 text-sm text-neutral-400'>This is where you can create a document and try MedSpeak for yourself.</p>
          </div>
        </motion.button>

        <motion.button className="flex flex-col justify-between text-left border border-neutral-700 min-w-[150px] w-[49%] p-5 rounded-xl"
          onClick={() => router.push('/newdoc')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ borderColor: '#99ffcc' }}
          transition={{ duration: 0.5 }}
        >
          <ChatBubbleIcon className='mb-12 h-8 w-8'/> 
          <div>
            <h3 className='text-md'>Give Feedback</h3>
            <p className='leading-10 text-sm text-neutral-400'>We'd love to hear how we can improve MedSpeak to fit your needs.</p>
          </div>
        </motion.button>
      </div>

      <div className='mt-4 w-full p-5'>
        <h1 className='text-lg'>Overview</h1>
        <p className='leading-10 text-sm text-neutral-400'>
          Nothing yet...
        </p>
      </div>
    </main>
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
