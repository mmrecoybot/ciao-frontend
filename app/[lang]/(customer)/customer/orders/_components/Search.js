'use client';
import debounce from "@/utils/debounce";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Search({ searchParams }) {
  const [search, setSearch] = useState("");
  const handleSearch = debounce((e) => setSearch(e.target.value), 500);
  const { replace } = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if(search){
        params.set("search", search);
    }else{
        params.delete("search");
    }
    replace(`?${params.toString()}`);
  }, [search]);


  return (
    <input
      type="search"
      placeholder="Search..."
      className="w-full border rounded px-3 py-2 text-sm"
      onChange={handleSearch}
    />
  );
}
