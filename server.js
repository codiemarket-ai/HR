/**
 * IPPS - Integrated Personnel & Payroll System (Egypt)
 * Main Server File
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// استيراد إعدادات قاعدة البيانات والمسارات
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const salfahRoutes = require('./routes/salfahRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const penaltyRoutes = require('./routes/penaltyRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const positionRoutes = require('./routes/positionRoutes');
const settingRoutes = require('./routes/settingRoutes');
const authRoutes = require('./routes/authRoutes');

// 1. إعدادات البيئة والاتصال
dotenv.config();
connectDB(); // الاتصال بـ MongoDB

const app = express();

// 2. الميدلوير (Middleware) - الأمان ومعالجة البيانات
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'"],
        },
    },
})); // حماية الرأس (Headers) مع السماح بـ Swagger UI CDN
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://hr-front-iota.vercel.app', 'https://hr-two-jade.vercel.app', 'https://hr-a76j0j2de-mahmouds-projects-b44fdbbd.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'role'],
    credentials: true
}));   // السماح بالاتصال من الـ Frontend (Next.js)
app.use(express.json()); // قراءة بيانات الـ JSON

// 3. إعدادات توثيق API (Swagger)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IPPS Egypt HR & Payroll API',
            version: '1.0.0',
            description: 'النظام المتكامل لإدارة الأفراد والرواتب وفقاً للقانون المصري',
            contact: {
                name: "Backend Support",
                url: "https://codiemarket.com/qc"
            }
        },
        servers: [
            {
                url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 5000}`,
                description: process.env.VERCEL_URL ? 'Production Server' : 'Development Server'
            }
        ],
    },
    // تحديد أماكن ملفات المسارات ليتم قراءة الـ Swagger Comments منها
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI options for Vercel (use CDN for static assets)
const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js'
    ],
    swaggerOptions: {
        persistAuthorization: true,
    },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

// 4. تسجيل المسارات (API Endpoints)
app.use('/api/people', employeeRoutes);  // Deprecated path? Keeping just in case or standardizing
app.use('/api/employees', employeeRoutes);     // إدارة الموظفين
app.use('/api/departments', departmentRoutes); // إدارة الأقسام
app.use('/api/positions', positionRoutes);     // إدارة الوظائف
app.use('/api/tasks', taskRoutes);             // التكليفات والمهام
app.use('/api/payroll', payrollRoutes);         // محرك الرواتب والضرائب
app.use('/api/salfah', salfahRoutes);           // السلف والقروض
app.use('/api/performance', performanceRoutes); // تقييم الأداء والـ KPIs
app.use('/api/penalties', penaltyRoutes);       // الجزاءات
app.use('/api/settings', settingRoutes);        // إعدادات النظام
app.use('/api/auth', authRoutes);               // المصادقة

// 5. مسار فحص الحالة (Health Check)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', environment: process.env.NODE_ENV || 'development' });
});

// 6. معالجة الأخطاء العامة (Global Error Handler)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "حدث خطأ داخلي في الخادم",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 7. تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    ====================================================
    🚀 IPPS Server is running on port: ${PORT}
    📖 Swagger Docs: http://localhost:${PORT}/api-docs
    ✅ MongoDB: Connected
    ====================================================
    `);
});
