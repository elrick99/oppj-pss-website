"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "oppj-install-dismissed"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (isStandalone || dismissed) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, "1")
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:left-auto sm:right-4 sm:w-96 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0F2260] p-4 shadow-2xl">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Download className="size-5 text-[#D4A520]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Installer OPPJ Jeunesse</p>
          <p className="text-xs text-white/60">Accès rapide depuis votre écran d&apos;accueil</p>
        </div>
        <Button size="sm" onClick={install} className="bg-[#D4A520] text-[#0F2260] hover:bg-[#F0C84A] shrink-0">
          Installer
        </Button>
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="shrink-0 text-white/40 hover:text-white/70 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
