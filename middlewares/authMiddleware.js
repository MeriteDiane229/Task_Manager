/* const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Accès refusé" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalide" });
    }
};

module.exports = authMiddleware; */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    console.log("Token reçu :", token); // 🔍 Affiche le token reçu

    if (!token) {
        return res.status(401).json({ message: "Accès refusé, aucun token fourni" });
    }

    try {
        const tokenSplit = token.split(" ");
        if (tokenSplit[0] !== "Bearer") {
            console.log("Format du token incorrect");
            return res.status(401).json({ message: "Format de token invalide" });
        }

        const decoded = jwt.verify(tokenSplit[1], process.env.JWT_SECRET);
        console.log("Token décodé :", decoded); // 🔍 Affiche le contenu du token

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Erreur JWT :", err.message);
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

module.exports = authMiddleware;
