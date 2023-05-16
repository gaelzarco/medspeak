import Image from 'next/image'
import { signIn } from 'next-auth/react'

export default function Landing() {
    return (
        <div className="inline-flex min-w-screen w-full min-h-screen h-full">
            <div className="flex flex-col h-screen w-full">
                <div className="flex h-min top-0 -mt-6 ml-5">
                    <Image src='/medspeaklandinglogo.svg' height={100} width={200} alt='MedSpeak Logo'/>
                </div>

                <div className="flex flex-col w-3/4 m-auto pr-8">
                    <h1 className="text-3xl font-semibold">Steamline patient and doctor communication.</h1>
                    <h1 className="mt-5">
                    Find out why MedSpeak™ is the next-generation of healthcare prodcutivity.
                    </h1>

                    <div className='inline-flex mt-5'>
                        <button className="bg-transparent border border-neutral-700 hover:border-neutral-600 w-[150px] text-white font-bold py-2 px-4 mr-2 rounded-lg"
                            onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/' })}
                        >
                            Try it now
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <video className="w-full h-screen object-cover" autoPlay loop muted disablePictureInPicture>
                    <source src="/medspeakbg.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    )
}