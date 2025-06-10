const logout = async (req, res) => {
     await res.clearCookie("token");
     res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = logout;