const express = require('express');
const router  = express.Router();
const Review  = require('../models/Review');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('order_id');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit a review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get average ratings summary
router.get('/summary', async (req, res) => {
  try {
    const reviews = await Review.find();
    if (reviews.length === 0) {
      return res.json({ message: 'No reviews yet' });
    }
    const avg = (key) => (
      reviews.reduce((sum, r) => sum + r[key], 0) / reviews.length
    ).toFixed(1);
    res.json({
      total_reviews:   reviews.length,
      food_avg:        avg('food_rating'),
      service_avg:     avg('service_rating'),
      ambiance_avg:    avg('ambiance_rating')
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;