// ميدلوير مرن للتحقق من الأدوار
exports.authorize = (allowedRoles) => {
    return (req, res, next) => {
        // نأخذ الدور من الهيدر (في المرحلة الحالية من المشروع)
        const userRole = req.headers['role']; 

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                success: false, 
                message: `عذراً، هذا الإجراء متاح فقط للأدوار التالية: [${allowedRoles.join(', ')}]` 
            });
        }
        next();
    };
};