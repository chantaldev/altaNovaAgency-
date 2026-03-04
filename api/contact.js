const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    try {
        const data = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: 'cesia.chantal@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
