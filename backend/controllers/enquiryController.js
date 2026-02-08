const pool = require('../config/database');
const nodemailer = require('../config/email');

// Submit new enquiry
const submitEnquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message, service_type } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, subject, message are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Get client info
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Save to database
        const query = `
            INSERT INTO enquiries 
            (name, email, phone, subject, message, service_type, ip_address, user_agent, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'new')
            RETURNING id, created_at
        `;
        
        const values = [name, email, phone, subject, message, service_type, ip, userAgent];
        
        const result = await pool.query(query, values);
        const enquiry = result.rows[0];

        // Send confirmation email to client
        try {
            await nodemailer.sendConfirmationEmail(email, name, subject);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        // Send notification to admin
        try {
            await nodemailer.sendAdminNotification({
                id: enquiry.id,
                name,
                email,
                phone,
                subject,
                message,
                service_type,
                created_at: enquiry.created_at
            });
        } catch (adminEmailError) {
            console.error('Failed to send admin notification:', adminEmailError);
        }

        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            enquiryId: enquiry.id,
            timestamp: enquiry.created_at
        });

    } catch (error) {
        console.error('Error submitting enquiry:', error);
        
        // Handle database errors
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ error: 'Duplicate submission detected' });
        }
        
        res.status(500).json({ 
            error: 'Failed to submit enquiry',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all enquiries (for admin dashboard)
const getAllEnquiries = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM enquiries';
        let countQuery = 'SELECT COUNT(*) FROM enquiries';
        const params = [];
        
        if (status) {
            query += ' WHERE status = $1';
            countQuery += ' WHERE status = $1';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
        
        const [enquiries, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, status ? [status] : [])
        ]);
        
        const total = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(total / limit);
        
        res.json({
            success: true,
            enquiries: enquiries.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
        
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
};

// Get single enquiry by ID
const getEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'SELECT * FROM enquiries WHERE id = $1';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Enquiry not found' });
        }
        
        res.json({
            success: true,
            enquiry: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching enquiry:', error);
        res.status(500).json({ error: 'Failed to fetch enquiry' });
    }
};

// Update enquiry status
const updateEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_notes } = req.body;
        
        if (!status || !['new', 'in_progress', 'responded', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        
        const query = `
            UPDATE enquiries 
            SET status = $1, admin_notes = COALESCE($2, admin_notes), updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `;
        
        const result = await pool.query(query, [status, admin_notes, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Enquiry not found' });
        }
        
        res.json({
            success: true,
            message: 'Enquiry status updated',
            enquiry: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(500).json({ error: 'Failed to update enquiry' });
    }
};

// Get statistics
const getEnquiryStats = async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'new' THEN 1 END) as new,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
                COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded,
                COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed,
                DATE(created_at) as date,
                COUNT(*) as daily_count
            FROM enquiries
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `;
        
        const result = await pool.query(query);
        
        res.json({
            success: true,
            statistics: {
                total: parseInt(result.rows[0]?.total || 0),
                byStatus: {
                    new: parseInt(result.rows[0]?.new || 0),
                    in_progress: parseInt(result.rows[0]?.in_progress || 0),
                    responded: parseInt(result.rows[0]?.responded || 0),
                    closed: parseInt(result.rows[0]?.closed || 0)
                },
                dailyTrends: result.rows.map(row => ({
                    date: row.date,
                    count: parseInt(row.daily_count)
                }))
            }
        });
        
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

module.exports = {
    submitEnquiry,
    getAllEnquiries,
    getEnquiryById,
    updateEnquiryStatus,
    getEnquiryStats
};