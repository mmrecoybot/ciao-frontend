import { auth } from "@/auth";

async function fetchData(api) {
const session = await auth();

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL_API}/api/v1${api}`, {
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export { fetchData };