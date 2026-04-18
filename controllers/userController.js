import User from '../models/User.js';

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const birdId = req.params.birdId;
    const index = user.favorites.indexOf(birdId);

    if (index === -1) {
      user.favorites.push(birdId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
