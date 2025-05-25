"use client";

import { useUser } from "@/hooks/useUser";
import { Check, Plus } from "lucide-react";
import clsx from "clsx";

type Props = {
  saved: boolean;
  onSave: () => Promise<void>;
};

export function SaveCityButton({ saved, onSave }: Props) {
  const user = useUser();

  if (!user) return null;

  return (
    <button
      onClick={saved ? undefined : onSave}
      disabled={saved}
      className={clsx(
        "absolute top-14 right-4 rounded-full p-2 shadow-md transition-colors",
        saved ? "bg-green-500 text-white cursor-default" : "bg-white text-gray-800 hover:bg-gray-100"
      )}
      aria-label={saved ? "City Saved" : "Save City"}
    >
      <span className="transition-all duration-200 ease-in-out">
        {saved ? <Check size={20} /> : <Plus size={20} />}
      </span>
    </button>
  );
} 