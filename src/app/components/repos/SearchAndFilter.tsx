"use client";

import { useDebounce } from "@/app/hooks/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { Input } from "../uilib/ui/input";

const SearchAndFilter = ({ pageNum }: { pageNum: string }) => {
  const rtr = useRouter();
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const searchValue = useDebounce(search, 500);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(data);
    };
    fetchTags();
  }, []);

  useEffect(() => {
    console.log(searchValue);
    console.log(selectedTags);

    rtr.push(
      `/repo?page=${pageNum}&tags=${selectedTags.join(",")}&q=${searchValue}`
    );
  }, [searchValue, selectedTags, rtr, pageNum]);

  return (
    <div className="flex items-center mb-4">
      <div className="w-1/3">
        <Multiselect
          options={tags}
          onSelect={setSelectedTags}
          onRemove={setSelectedTags}
          selectedValues={selectedTags}
          isObject={false}
          className="text-black mb-3 px-6 mt-4"
        />
      </div>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-1 bg-black text-white"
        placeholder="Search for a repo | username | description"
      />
    </div>
  );
};

export default SearchAndFilter;
