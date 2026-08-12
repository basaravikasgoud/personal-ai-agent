const User = require('../models/User');

// @desc Update user preferences
// @route PATCH /api/users/preferences
exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { autoRunAgent, defaultPriority, theme } = req.body;
    if (autoRunAgent !== undefined) user.preferences.autoRunAgent = autoRunAgent;
    if (defaultPriority) user.preferences.defaultPriority = defaultPriority;
    if (theme) user.preferences.theme = theme;

    await user.save();

    res.status(200).json({
      success: true,
      preferences: user.preferences,
    });
  } catch (error) {
    next(error);
  }
};
