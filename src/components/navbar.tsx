import Link from "next/link";

export default function Navbar() {
    return (
        <div className="inline-flex justify-between p-4 w-full">
            <div className="inline-flex justify-self-start font-semibold text-md">
                <h2>MedSpeak</h2>
            </div>
            <div className="inline-flex justify-self-right text-sm">
                <Link className='ps-8' href="dashboard">
                    <p>Dashboard</p>
                </Link>
                <Link className='ps-8' href='analytics'>
                    <p>Analytics</p>
                </Link>
                <Link className='ps-8' href="account">
                    <p>Account</p>
                </Link>
            </div>
        </div>
    )
}