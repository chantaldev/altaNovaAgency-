const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    // Use allowed methods only
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Safely parse JSON body
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid JSON payload' });
        }
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Fallbacks
    const toEmail = process.env.TO_EMAIL || 'cesia.chantal@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    try {
        const data = await resend.emails.send({
            from: `Contact Form <${fromEmail}>`,
            to: toEmail,
            reply_to: email, // Set to the sender's email
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

        res.status(200).json({ success: true, message: 'Message sent' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
