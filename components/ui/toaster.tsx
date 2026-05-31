'use client'

import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

const VARIANT_ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
  info: <Info className="w-5 h-5 text-royal shrink-0 mt-0.5" />,
  destructive: <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />,
  default: null as React.ReactNode,
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={5000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const icon = VARIANT_ICONS[(props.variant as keyof typeof VARIANT_ICONS) ?? 'default'] ?? null
        return (
          <Toast key={id} {...props}>
            {icon}
            <div className="grid gap-0.5 flex-1 min-w-0">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
