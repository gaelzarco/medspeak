import type { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'

export default function Home() {  
  return (
    <main className='flex flex-col items-center min-h-full w-full max-w-7xl p-5'>
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
