import type { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'

export default function Home() {  
  return (
    <main className='flex flex-col min-h-full w-full max-w-7xl p-5'>
      <div className='flex w-full justify-between'>
        <input 
          type='text'
          placeholder='Search Docs'
          className='bg-transparent border border-neutral-700 hover:border-neutral-600 rounded-lg w-3/4 mr-5 h-10 px-5 text-sm outline-none'
        />

        <button className="text-sm inline-flex items-center content-center justify-center border border-neutral-700 hover:border-neutral-600 min-w-[150px] py-2 px-4 mr-2 rounded-lg">
            Generate Doc
        </button>
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
