"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { CheckCircle2, ScanLine } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { sileo } from "sileo"

import { Card, CardContent } from "@/components/ui/card"

type Props = {
  onScan: (isbn: string) => void
}

export default function Scanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isInitialized = useRef(false)
  const [detected, setDetected] = useState(false)

  const handleDecoded = useEffectEvent((decodedText: string) => {
    setDetected(true)
    sileo.success({ title: "Scanned", description: decodedText })
    onScan(decodedText)
    setTimeout(() => setDetected(false), 3000)
  })

  useEffect(() => {
    if (isInitialized.current) return
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
        handleDecoded,
        () => {}
      )
      .catch((error) => console.error("Scanner start error:", error))

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
        isInitialized.current = false
      }
    }
  }, [])

  return (
    <Card className="overflow-hidden border-slate-200 bg-white">
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 text-sm font-medium ${detected ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}
      >
        {detected ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Barcode detected
          </>
        ) : (
          <>
            <ScanLine className="h-4 w-4" />
            Waiting for scan
          </>
        )}
      </div>
      <CardContent className="p-0">
        <div id="qr-reader" style={{ width: "100%" }} />
      </CardContent>
    </Card>
  )
}
