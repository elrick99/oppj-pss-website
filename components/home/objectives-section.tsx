const objectives = [
  {
    icon: "🙏",
    title: "Formation spirituelle",
    description:
      "Approfondir la foi catholique des jeunes à travers des retraites, enseignements et célébrations eucharistiques régulières.",
    color: "from-royal to-royal-light",
    iconBg: "from-royal to-royal-light",
  },
  {
    icon: "🤝",
    title: "Fraternité & Communion",
    description:
      "Créer des liens forts entre les jeunes de la paroisse dans un esprit de service mutuel et d'amour fraternel.",
    color: "from-gold to-gold-light",
    iconBg: "from-gold to-gold-light",
  },
  {
    icon: "📈",
    title: "Leadership chrétien",
    description:
      "Former des leaders capables de témoigner de leur foi dans tous les domaines de la société avec intégrité et compétence.",
    color: "from-royal-light to-royal",
    iconBg: "from-royal-light to-royal",
  },
  {
    icon: "🌍",
    title: "Action sociale",
    description:
      "S'engager concrètement auprès des plus vulnérables à travers des projets caritatifs et des actions de solidarité.",
    color: "from-gold-light to-gold",
    iconBg: "from-gold-light to-gold",
  },
]

export function ObjectivesSection() {
  return (
    <section id="objectifs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">
            NOTRE MISSION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-royal-dark mt-3 mb-4">
            Nos objectifs fondateurs
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Tout ce que nous faisons est guidé par ces piliers qui forment l&apos;identité de notre mouvement de jeunesse.
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objectives.map((obj) => (
            <div
              key={obj.title}
              className="group relative bg-off-white rounded-3xl p-8 border border-royal/5 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${obj.color}`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${obj.iconBg} flex items-center justify-center text-2xl mb-5 shadow-sm`}>
                {obj.icon}
              </div>

              <h3 className="font-semibold text-lg text-royal-dark mb-3">
                {obj.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {obj.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
