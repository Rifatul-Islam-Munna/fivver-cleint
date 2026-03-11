"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  onSubmit: (isbn: string) => void
  loading: boolean
}

export default function ISBNInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          ISBN number
        </label>
        <Input
          placeholder="Enter ISBN number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
          className="h-12 rounded-xl border-slate-200 bg-white px-4"
        />
      </div>

      <Button
        onClick={() => onSubmit(value)}
        disabled={loading}
        className="h-12 w-full justify-center rounded-xl bg-[#00cec8] px-4 text-center text-slate-950 hover:bg-[#00b8b3] sm:mt-auto sm:w-auto"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  )
}
