"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card, CardContent } from "@/components/ui/card"
import { sileo } from "sileo"
import { ScanLine, CheckCircle2 } from "lucide-react"

type Props = {
  onScan: (isbn: string) => void
}

export default function Scanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isInitialized = useRef(false) // ✅ guard flag
  const [detected, setDetected] = useState(false)

  useEffect(() => {
    if (isInitialized.current) return // ✅ stop second run
    isInitialized.current = true

    const scanner = new Html5Qrcode("qr-reader")
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          setDetected(true)
          sileo.success({ title: "Scanned!", description: decodedText })
          onScan(decodedText)
          setTimeout(() => setDetected(false), 3000)
        },
        () => {}
      )
      .catch((err) => console.error("Scanner start error:", err))

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
        isInitialized.current = false // ✅ reset on real unmount
      }
    }
  }, [])

  return (
    <Card className="overflow-hidden">
      <div
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${detected ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}
      >
        {detected ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Barcode detected!
          </>
        ) : (
          <>
            <ScanLine className="h-4 w-4" /> Waiting for scan...
          </>
        )}
      </div>
      <CardContent className="p-0">
        <div id="qr-reader" style={{ width: "100%" }} />
      </CardContent>
    </Card>
  )
}
