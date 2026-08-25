import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import { CheckCircle2, XCircle, Clock, Shield } from 'lucide-react'
import type { Metadata } from 'next'

type Props = { params: Promise<{ memberId: string }> }

const STATUT_CONFIG = {
  actif: {
    label: 'Membre actif',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    dotColor: 'bg-emerald-500',
    Icon: CheckCircle2,
    verified: true,
  },
  inactif: {
    label: 'Inactif',
    color: 'text-gray-500',
    bg: 'bg-gray-50 border-gray-200',
    dotColor: 'bg-gray-400',
    Icon: XCircle,
    verified: false,
  },
  suspendu: {
    label: 'Suspendu',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    dotColor: 'bg-red-500',
    Icon: XCircle,
    verified: false,
  },
  en_attente: {
    label: "En attente d'activation",
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-400',
    Icon: Clock,
    verified: false,
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { memberId } = await params
  return {
    title: `Vérification membre — ${memberId} | OPPJ Jeunesse`,
    description: "Vérification de la carte de membre officielle OPPJ Jeunesse.",
    robots: { index: false, follow: false },
  }
}

export default async function VerificationCartePage({ params }: Props) {
  const { memberId } = await params

  const parts = memberId.split('-')
  let member: { nom: string; prenom: string; photoUrl: string | null; statut: string | null } | undefined
  let valid = false

  if (parts.length === 3 && parts[0] === 'OPPJ') {
    const userId = parseInt(parts[2], 10)
    if (!isNaN(userId)) {
      member = await db
        .select({
          nom: utilisateurs.nom,
          prenom: utilisateurs.prenom,
          photoUrl: utilisateurs.photoUrl,
          statut: utilisateurs.statut,
        })
        .from(utilisateurs)
        .where(eq(utilisateurs.id, userId))
        .get()
      valid = !!member
    }
  }

  const year = parts[1] ?? new Date().getFullYear().toString()
  const statutKey = (member?.statut ?? 'inactif') as keyof typeof STATUT_CONFIG
  const config = STATUT_CONFIG[statutKey] ?? STATUT_CONFIG.inactif
  const { Icon } = config
  const initials = member
    ? `${member.prenom[0]}${member.nom[0]}`.toUpperCase()
    : '??'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2260] via-[#1A3A8F] to-[#0a1a52] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header OPPJ */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
            <Image src="/logo-oppj.png" alt="OPPJ" width={40} height={40} />
          </div>
          <div className="text-center">
            <p className="text-white/50 text-xs uppercase tracking-widest">Vérification officielle</p>
            <h1 className="font-serif font-bold text-white text-xl mt-0.5">OPPJ Jeunesse</h1>
            <p className="text-white/40 text-xs mt-0.5">Paroisse Sacrés Stigmates — Abidjan</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {valid && member ? (
            <>
              {/* Status banner */}
              <div className={`px-6 py-3 flex items-center gap-2 border-b ${config.bg}`}>
                <span className={`w-2 h-2 rounded-full ${config.dotColor} flex-shrink-0`} />
                <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
                <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
                {config.verified && (
                  <span className="ml-auto text-xs text-emerald-600 font-medium bg-emerald-100 px-2 py-0.5 rounded-full">
                    Vérifié
                  </span>
                )}
              </div>

              {/* Member info */}
              <div className="px-6 py-7 flex flex-col items-center gap-5">
                {member.photoUrl ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-[#1A3A8F]/20">
                    <Image
                      src={member.photoUrl}
                      alt={member.prenom}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0F2260] to-[#1A3A8F] flex items-center justify-center ring-4 ring-[#1A3A8F]/20">
                    <span className="text-white font-bold text-2xl font-serif">{initials}</span>
                  </div>
                )}

                <div className="text-center">
                  <h2 className="font-serif font-bold text-[#0F2260] text-2xl leading-tight">
                    {member.prenom} {member.nom.toUpperCase()}
                  </h2>
                  <p className="text-[#1A3A8F]/60 font-mono text-sm mt-1">{memberId}</p>
                </div>

                <div className="w-full divide-y divide-gray-100">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400 text-sm">Organisation</span>
                    <span className="text-gray-800 font-semibold text-sm">OPPJ Jeunesse</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400 text-sm">Validité</span>
                    <span className="text-gray-800 font-semibold text-sm">31 Décembre {year}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400 text-sm">Statut</span>
                    <span className={`font-semibold text-sm ${config.color}`}>{config.label}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-start gap-3 border-t border-gray-100">
                <Shield className="w-4 h-4 text-[#1A3A8F] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Cette page certifie l&apos;appartenance de ce membre à l&apos;OPPJ Jeunesse.
                  En cas de doute, contactez le bureau de l&apos;association.
                </p>
              </div>
            </>
          ) : (
            <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-gray-800 text-xl">Membre introuvable</h2>
                <p className="text-gray-500 text-sm mt-2">
                  Aucun membre ne correspond à l&apos;identifiant <span className="font-mono font-semibold">{memberId}</span>.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Cette carte pourrait être invalide ou expirée. Veuillez contacter le bureau OPPJ pour vérification.
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          oppj-jeunesse.ci · {year}
        </p>
      </div>
    </div>
  )
}
