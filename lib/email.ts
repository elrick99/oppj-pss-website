import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

const FROM = `"${process.env.MAIL_FROM_NAME || 'OPPJ Sacrés Stigmates'}" <${process.env.MAIL_FROM_ADDRESS || 'noreply@oppj.ci'}>`

export async function sendConfirmationReservation(
  to: string,
  prenom: string,
  evenementTitre: string,
  codeReservation: string
): Promise<void> {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Confirmation de réservation — ${evenementTitre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3A8F;">Votre réservation est confirmée !</h2>
        <p>Bonjour ${prenom},</p>
        <p>Votre réservation pour <strong>${evenementTitre}</strong> a bien été enregistrée.</p>
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">Code de réservation</p>
          <p style="margin: 8px 0 0; font-size: 24px; font-weight: bold; color: #1A3A8F;">${codeReservation}</p>
        </div>
        <p>Présentez ce code le jour de l'événement.</p>
        <p>Que Dieu vous bénisse,<br><strong>L'équipe OPPJ</strong></p>
      </div>
    `,
  })
}

export async function sendNewsletterConfirmation(
  to: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Confirmez votre inscription à la newsletter OPPJ',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3A8F;">Confirmez votre inscription</h2>
        <p>Merci de vous être inscrit(e) à la newsletter OPPJ !</p>
        <p>Cliquez sur le bouton ci-dessous pour confirmer votre inscription :</p>
        <a href="${baseUrl}/api/newsletter/confirm/${token}"
           style="display: inline-block; background: #D4A520; color: #1A3A8F; padding: 12px 24px; border-radius: 24px; font-weight: bold; text-decoration: none; margin: 16px 0;">
          Confirmer mon inscription
        </a>
        <p style="font-size: 12px; color: #999;">Si vous n'avez pas demandé cette inscription, ignorez cet email.</p>
      </div>
    `,
  })
}

export async function sendNewsletter(
  recipients: string[],
  subject: string,
  htmlContent: string
): Promise<void> {
  await transporter.sendMail({
    from: FROM,
    bcc: recipients,
    subject,
    html: htmlContent,
  })
}

export async function sendActivationCompte(
  to: string,
  prenom: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Activez votre compte OPPJ',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3A8F;">Bienvenue dans la communauté OPPJ, ${prenom} !</h2>
        <p>Votre compte a bien été créé. Il ne vous reste plus qu'à l'activer en cliquant sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${baseUrl}/api/auth/activer/${token}"
             style="display: inline-block; background: #1A3A8F; color: #ffffff; padding: 14px 32px; border-radius: 24px; font-weight: bold; text-decoration: none; font-size: 16px;">
            Activer mon compte
          </a>
        </div>
        <p style="font-size: 12px; color: #999;">Ce lien est valable 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.</p>
        <p>Que Dieu vous bénisse,<br><strong>L'équipe OPPJ</strong></p>
      </div>
    `,
  })
}

export async function sendBienvenue(
  to: string,
  prenom: string
): Promise<void> {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Votre compte OPPJ est actif !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3A8F;">Compte activé avec succès !</h2>
        <p>Bonjour ${prenom},</p>
        <p>Votre compte OPPJ est maintenant actif. Vous pouvez vous connecter et profiter de tous les services de la communauté.</p>
        <div style="background: #f0f4ff; border-left: 4px solid #1A3A8F; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1A3A8F; font-weight: bold;">Prochaines étapes</p>
          <ul style="margin: 8px 0 0; color: #333;">
            <li>Consultez les événements à venir</li>
            <li>Inscrivez-vous à la newsletter</li>
            <li>Découvrez les activités de votre commission</li>
          </ul>
        </div>
        <p>Que Dieu vous bénisse,<br><strong>L'équipe OPPJ</strong></p>
      </div>
    `,
  })
}

export async function sendReinitialisationMotDePasse(
  to: string,
  prenom: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Réinitialisation de votre mot de passe OPPJ',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3A8F;">Réinitialisation de mot de passe</h2>
        <p>Bonjour ${prenom},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau :</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${baseUrl}/reinitialiser-mot-de-passe?token=${token}"
             style="display: inline-block; background: #D4A520; color: #1A3A8F; padding: 14px 32px; border-radius: 24px; font-weight: bold; text-decoration: none; font-size: 16px;">
            Choisir un nouveau mot de passe
          </a>
        </div>
        <p style="font-size: 12px; color: #999;">Ce lien est valable 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email — votre mot de passe ne changera pas.</p>
        <p>Que Dieu vous bénisse,<br><strong>L'équipe OPPJ</strong></p>
      </div>
    `,
  })
}

export async function sendNotificationNouvelleReservation(
  destination: string,
  nom: string,
  prenom: string,
  email: string,
  evenementTitre: string,
  codeReservation: string,
  nombrePlaces: number
): Promise<void> {
  await transporter.sendMail({
    from: FROM,
    to: destination,
    subject: `[OPPJ] Nouvelle réservation — ${evenementTitre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3A8F;">Nouvelle réservation reçue</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Événement :</td><td style="padding: 8px 0; font-weight: bold;">${evenementTitre}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Participant :</td><td style="padding: 8px 0;">${prenom} ${nom}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email :</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1A3A8F;">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Places :</td><td style="padding: 8px 0;">${nombrePlaces}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Code :</td><td style="padding: 8px 0; font-weight: bold; color: #1A3A8F;">${codeReservation}</td></tr>
        </table>
        <p style="font-size: 12px; color: #999;">Gérez cette réservation depuis le panneau d'administration OPPJ.</p>
      </div>
    `,
  })
}

export async function sendStatutReservation(
  to: string,
  prenom: string,
  statut: string,
  evenementTitre: string,
  codeReservation: string
): Promise<void> {
  const messages: Record<string, { sujet: string; titre: string; corps: string; couleur: string }> = {
    confirme: {
      sujet: `Réservation confirmée — ${evenementTitre}`,
      titre: 'Votre réservation est confirmée !',
      corps: 'Bonne nouvelle ! Votre réservation a été confirmée par l\'équipe OPPJ.',
      couleur: '#16a34a',
    },
    annule: {
      sujet: `Réservation annulée — ${evenementTitre}`,
      titre: 'Réservation annulée',
      corps: 'Nous vous informons que votre réservation a été annulée. Contactez-nous pour plus d\'informations.',
      couleur: '#dc2626',
    },
    en_attente: {
      sujet: `Réservation en attente — ${evenementTitre}`,
      titre: 'Réservation en attente de validation',
      corps: 'Votre réservation est en attente de validation par notre équipe. Nous vous contacterons prochainement.',
      couleur: '#d97706',
    },
  }

  const msg = messages[statut]
  if (!msg) return

  await transporter.sendMail({
    from: FROM,
    to,
    subject: msg.sujet,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${msg.couleur};">${msg.titre}</h2>
        <p>Bonjour ${prenom},</p>
        <p>${msg.corps}</p>
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">Événement</p>
          <p style="margin: 4px 0 12px; font-weight: bold;">${evenementTitre}</p>
          <p style="margin: 0; font-size: 14px; color: #666;">Code de réservation</p>
          <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold; color: #1A3A8F;">${codeReservation}</p>
        </div>
        <p>Que Dieu vous bénisse,<br><strong>L'équipe OPPJ</strong></p>
      </div>
    `,
  })
}

export async function sendContact(
  destination: string,
  senderEmail: string,
  senderName: string,
  subject: string,
  message: string
): Promise<void> {
  await transporter.sendMail({
    from: FROM,
    to: destination,
    replyTo: `"${senderName}" <${senderEmail}>`,
    subject: subject ? `[Contact OPPJ] ${subject}` : '[Contact OPPJ] Nouveau message',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3A8F;">Nouveau message de contact</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 120px;">De :</td>
            <td style="padding: 8px 0; font-weight: bold;">${senderName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email :</td>
            <td style="padding: 8px 0;"><a href="mailto:${senderEmail}" style="color: #1A3A8F;">${senderEmail}</a></td>
          </tr>
          ${subject ? `<tr><td style="padding: 8px 0; color: #666;">Sujet :</td><td style="padding: 8px 0;">${subject}</td></tr>` : ''}
        </table>
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; border-left: 4px solid #D4A520;">
          <p style="margin: 0; white-space: pre-wrap; color: #333;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 24px;">
          Message reçu via le formulaire de contact du site OPPJ Sacrés Stigmates.
        </p>
      </div>
    `,
  })
}
