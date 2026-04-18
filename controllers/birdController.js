import Bird from '../models/Bird.js';

export const getAllBirds = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const total = await Bird.countDocuments(query);
    const birds = await Bird.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ birds, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBirdById = async (req, res) => {
  try {
    const bird = await Bird.findById(req.params.id);
    if (!bird) return res.status(404).json({ message: '找不到此鳥類' });
    res.json(bird);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBird = async (req, res) => {
  try {
    const bird = await Bird.create(req.body);
    res.status(201).json(bird);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBird = async (req, res) => {
  try {
    const bird = await Bird.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bird) return res.status(404).json({ message: '找不到此鳥類' });
    res.json(bird);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBird = async (req, res) => {
  try {
    const bird = await Bird.findByIdAndDelete(req.params.id);
    if (!bird) return res.status(404).json({ message: '找不到此鳥類' });
    res.json({ message: '刪除成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
