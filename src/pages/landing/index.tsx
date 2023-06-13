import Image from "next/image";
import { signIn } from "next-auth/react";
import { CaretDownIcon } from "@radix-ui/react-icons";

export default function Landing() {
  return (
    <>
      <div className="inline-flex w-full h-screen">
        <div className="flex flex-col h-full w-full">
          <div className="flex h-min top-0 -mt-12">
            <Image
              src="/medspeaklandinglogo.svg"
              height={100}
              width={200}
              alt="MedSpeak Logo"
            />
          </div>

          <div className="flex flex-col w-3/4 m-auto pr-8">
            <h1 className="text-3xl font-semibold">
              Steamline patient and staff communication.
            </h1>
            <h1 className="mt-5">
              Find out why MedSpeak™ is the next-generation of healthcare
              prodcutivity.
            </h1>

            <div className="inline-flex mt-5">
              <button
                className="bg-transparent border border-neutral-700 hover:border-neutral-600 w-[150px] text-white font-bold py-2 px-4 mr-2 rounded-full"
                onClick={() =>
                  signIn("google", {
                    callbackUrl:
                      process.env.NODE_ENV === "production"
                        ? "https://medspeak.vercel.app/"
                        : "http://localhost:3000/",
                  })
                }
              >
                Try it now
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            disablePictureInPicture
          >
            <source src="/medspeakbg.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="min-w-screen w-full min-h-screen h-full">
        <h1>Created by Gael Zarco & Chris James Galacgac</h1>
      </div>

      <div className="absolute bottom-0 mt-72 flex flex-col mr-28 mb-10">
        <CaretDownIcon className="animate-pulse w-6 h-6" />
        <CaretDownIcon className="animate-pulse w-6 h-6 -mt-4" />
      </div>
    </>
  );
}
