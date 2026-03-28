const nodemailer = require('nodemailer');

// --- REUSABLE TRANSPORTER SOCKET (MIRRORED FROM AUTH) ---
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });
};

exports.sendInquiry = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ msg: 'All identity fields required for uplink.' });
        }

        const transporter = createTransporter();
        
        // --- INQUIRY DISPATCH ---
        await transporter.sendMail({
            from: `"Drope Inquiry" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // SEND DIRECTLY TO THE ADMIN (USER)
            replyTo: email,
            subject: `New Inquiry from ${name}`,
            html: `
                <div style="background:#050505; color:white; padding:40px; border-radius:24px; font-family:sans-serif; border: 1px solid #10B981;">
                    <h1 style="color:#10B981; font-style:italic; margin-bottom:30px;">Inquiry Connection Established</h1>
                    <div style="margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.1); pb:20px;">
                        <p style="text-transform:uppercase; letter-spacing:3px; font-size:10px; color:#888; margin-bottom:5px;">Source Node:</p>
                        <p style="font-size:18px; font-weight:bold;">${name} &lt;${email}&gt;</p>
                    </div>
                    <div>
                        <p style="text-transform:uppercase; letter-spacing:3px; font-size:10px; color:#888; margin-bottom:5px;">Message Payload:</p>
                        <p style="font-size:16px; line-height:1.6; color:#ccc;">${message}</p>
                    </div>
                    <p style="margin-top:40px; font-size:10px; color:#444; border-top:1px solid rgba(255,255,255,0.05); pt:20px;">ID: ${Date.now()}-INQUIRY-SECURE</p>
                </div>`
        });

        res.status(200).json({ msg: 'Transmission successful. Connection established.' });
    } catch (err) {
        console.error('INQUIRY_DISPATCH_FAILURE:', err);
        res.status(500).json({ msg: 'Transmission failed. Uplink error.' });
    }
};
