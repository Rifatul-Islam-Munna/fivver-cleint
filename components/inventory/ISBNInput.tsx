"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type Props = {
  onSubmit: (isbn: string) => void
  loading: boolean
}

export default function ISBNInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("")

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter ISBN number..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
        className="flex-1"
      />
      <Button onClick={() => onSubmit(value)} disabled={loading}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
