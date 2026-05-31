"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    details: ["Paroisse Sacrés Stigmates, Abidjan,", "Côte d'Ivoire"],
    bgColor: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    icon: Phone,
    title: "Téléphone",
    details: ["+225 07 XX XX XX XX"],
    bgColor: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["oppj.sacresstgmates@gmail.com"],
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    icon: Clock,
    title: "Réunions hebdomadaires",
    details: ["Chaque dimanche après la messe ·", "11h30 – 13h00"],
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
  },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <section id="contact" className="py-20 bg-royal-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info */}
          <div>
            <span className="text-gold text-xs font-bold tracking-[3px] uppercase">
              PARLONS-NOUS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 mb-6">
              Contactez-nous
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-10 max-w-md">
              Vous avez des questions sur nos activités, vous souhaitez rejoindre l&apos;OPPJ ou simplement en savoir plus ? Nous sommes là pour vous.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4"
                >
                  <div className={`w-12 h-12 ${item.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-white/60 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
            <h3 className="font-serif text-2xl font-bold text-royal-dark mb-6">
              Envoyez-nous un message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Prénom</label>
                  <input
                    type="text"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-royal/15 bg-white text-gray-800 placeholder:text-gray-400 focus:border-royal focus:ring-2 focus:ring-royal/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Nom</label>
                  <input
                    type="text"
                    placeholder="Kouassi"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-royal/15 bg-white text-gray-800 placeholder:text-gray-400 focus:border-royal focus:ring-2 focus:ring-royal/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="jean@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-royal/15 bg-white text-gray-800 placeholder:text-gray-400 focus:border-royal focus:ring-2 focus:ring-royal/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Sujet</label>
                <input
                  type="text"
                  placeholder="Je souhaite rejoindre l'OPPJ"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-royal/15 bg-white text-gray-800 placeholder:text-gray-400 focus:border-royal focus:ring-2 focus:ring-royal/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Message</label>
                <textarea
                  rows={4}
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-royal/15 bg-white text-gray-800 placeholder:text-gray-400 focus:border-royal focus:ring-2 focus:ring-royal/10 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-royal text-white py-4 rounded-xl font-semibold hover:bg-royal-dark transition-colors"
              >
                Envoyer le message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-16">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
