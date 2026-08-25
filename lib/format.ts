export function formatDate(dateStr: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', opts ?? { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateLong(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function formatTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function formatMontant(val: number | null | undefined): string {
  if (!val || val === 0) return 'Gratuit'
  return `${Number(val).toLocaleString('fr-FR')} FCFA`
}

export function formatFCFA(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M FCFA`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K FCFA`
  return `${val.toLocaleString('fr-FR')} FCFA`
}

export function formatInitials(prenom?: string, nom?: string): string {
  const p = (prenom ?? '').charAt(0).toUpperCase()
  const n = (nom ?? '').charAt(0).toUpperCase()
  return `${p}${n}` || '??'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
