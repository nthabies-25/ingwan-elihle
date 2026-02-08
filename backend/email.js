const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Test email configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Send confirmation email to client
const sendConfirmationEmail = async (to, name, subject) => {
    const mailOptions = {
        from: `"Ingwan'Elihle" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Enquiry Received - Ingwan\'Elihle Health & Safety',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="background: #0E766C; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">Ingwan'Elihle</h1>
                    <p style="margin: 5px 0 0; opacity: 0.9;">Health & Safety Management Consultants</p>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #0E766C;">Thank you for your enquiry, ${name}!</h2>
                    <p>We have received your enquiry regarding: <strong>${subject}</strong></p>
                    <p>Our team will review your request and get back to you within 24-48 hours during business hours.</p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #D4B483;">
                        <h4 style="margin-top: 0; color: #0E766C;">What happens next?</h4>
                        <ul style="margin-bottom: 0;">
                            <li>Our team will assess your requirements</li>
                            <li>We'll contact you to discuss your needs</li>
                            <li>We'll provide a tailored solution proposal</li>
                        </ul>
                    </div>
                    
                    <p>If you have any urgent questions, please contact us at:</p>
                    <p style="margin: 10px 0;">
                        📞 <strong>Phone:</strong> +27 77 439 9165<br>
                        📧 <strong>Email:</strong> info@ingwanelihle.co.za
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #666; font-size: 14px;">
                        This is an automated confirmation. Please do not reply to this email.<br>
                        © ${new Date().getFullYear()} Ingwan'Elihle Health & Safety Management Consultants
                    </p>
                </div>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

// Send notification to admin
const sendAdminNotification = async (enquiry) => {
    const mailOptions = {
        from: `"Ingwan'Elihle Enquiry System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🔔 New Enquiry Received: ${enquiry.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0E766C;">New Enquiry Received</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid #0E766C;">
                    <h3 style="margin-top: 0;">Enquiry Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ID:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${enquiry.id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${enquiry.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${enquiry.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${enquiry.phone || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${enquiry.service_type || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Received:</strong></td>
                            <td style="padding: 8px 0;">${new Date(enquiry.created_at).toLocaleString()}</td>
                        </tr>
                    </table>
                    
                    <h4 style="margin: 20px 0 10px; color: #0E766C;">Message:</h4>
                    <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                        ${enquiry.message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3001/admin'}" 
                       style="background: #0E766C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        View in Dashboard
                    </a>
                </div>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    Enquiry ID: ${enquiry.id} • IP: ${enquiry.ip_address || 'Unknown'}
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    transporter,
    sendConfirmationEmail,
    sendAdminNotification
};