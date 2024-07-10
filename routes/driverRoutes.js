const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', driverController.loginDriver);
router.post('/register', driverController.registerDriver);
router.patch('/:id/location', authMiddleware, driverController.updateLocation);
router.patch(
  '/:id/availability',
  authMiddleware,
  driverController.updateAvailability
);
router.get('/:id', authMiddleware, driverController.getDriverDetails);
router.post('/review/:id', authMiddleware, driverController.addReview);
router.get('/reviews/:id', authMiddleware, driverController.getReviews);
module.exports = router;
