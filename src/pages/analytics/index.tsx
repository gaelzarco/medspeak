import type { NextPageContext } from "next";
import { getSession } from "next-auth/react";

export default function Analytics() {
  return (
    <div className="flex flex-col text-center m-auto items-center content-center justify-center min-h-[90vh] w-full max-w-7xl">
      <h1 className="text-neutral-600">Analytics under contruction</h1>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/landing",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
