import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token requerido" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.rol !== 1) {
        return res.status(403).json({ message: "Acceso denegado. Solo administradores" });
    }
    next();
};
