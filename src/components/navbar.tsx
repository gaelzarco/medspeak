import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { ChevronDownIcon, PersonIcon, ExitIcon } from "@radix-ui/react-icons"

export default function Navbar() {
    const { data: session } = useSession()
    const user = { ...session?.user }

    return (
        <nav className="inline-flex justify-between p-4 pt-7 pb-7 w-full max-w-7xl items-center">
            <div className="inline-flex justify-self-start font-semibold text-md">
                {user && (
                    <div className="inline-flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger className={`inline-flex w-max items-center my-auto focus-visible:outline-none ${inter.className}`}>
                                <Avatar>
                                    <AvatarImage src={user.image as string} />
                                    <AvatarFallback>{user.name?.toUpperCase().slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <p className="pl-4">{user.name}</p>
                                <ChevronDownIcon className="ml-4 h-4 w-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-black border-neutral-800">
                                <DropdownMenuItem className="hover:bg-neutral-900">
                                    <div className="inline-flex items-center justify-between w-full h-full">
                                        <p>My Account</p>
                                        <PersonIcon className="h-4 w-4" />
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-neutral-900" onClick={() => signOut()}>
                                    <div className="inline-flex items-center justify-between w-full h-full">
                                        <p>Sign-Out</p>
                                        <ExitIcon className="h-4 w-4" />
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
            
            <div className="inline-flex justify-self-right text-sm">
                <Link className='ps-8' href="/">
                    <p>Dashboard</p>
                </Link>
                <Link className='ps-8' href='/analytics'>
                    <p>Analytics</p>
                </Link>
            </div>
        </nav>
    )
}