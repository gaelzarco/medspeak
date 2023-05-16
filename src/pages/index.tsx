import type { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'

import Navbar from '@/components/navbar'

export default function Home() {  
  return (
    <main className='flex flex-col items-center min-h-screen w-full max-w-7xl p-5'>
      <div className='sticky z-1 top-0 w-full'>
       <Navbar />
      </div>

      <div className='flex h-full m-auto text-center items-center content-center justify-center'>
        <p className='text-neutral-400 text-sm'>Under Construction</p>
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
