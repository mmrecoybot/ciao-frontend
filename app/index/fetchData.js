async function fetchData(api) {
  const token = process.env.token;
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL_DEV}${api}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export default fetchData;
