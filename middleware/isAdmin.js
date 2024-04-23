function isAdmin(req, res, next) {
    // Check if the user is an admin (you might have a different way to verify this)
    const isAdmin = true; // Assuming the user is an admin for simplicity

    if (!isAdmin) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    next();
}