const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const eventController = require('../controllers/eventController')
const swapController = require('../controllers/swapController')

router.use(verifyToken); //this will protect all the routes below

// Testing route
router.get("/me", (req, res) => {
  res.json({ message: "Protected route accessed ✅", user: req.user });
});

// All the CURD operation events
router.get("/events/my", eventController.getMyEvents);
router.post("/events", eventController.createEvent);
router.patch("/events/:id/status", eventController.updateStatus);
router.delete("/events/:id", eventController.deleteEvent);

// Swap marketplace controller
router.get("/swappable-slots", swapController.getSwappableSlots);
//Request for a swap
router.post("/swap-request", swapController.requestSwap);
//Response to a swap request
router.post("/swap-response/:requestId", swapController.respondSwap);

//for getting all my swappable slots
router.get("/my-swappable-slots", swapController.getMySwappableSlots);
//for getting all my incoming swapping requests that I received from other users
router.get("/swap-requests/incoming", swapController.getIncomingRequests);
//for getting all the swapping requests I have sent to other users
router.get("/swap-requests/outgoing", swapController.getOutgoingRequests);
//for logging out the user
router.post("/logout", (req, res) => {
  res.clearCookie("token",{httpOnly:true,secure:false,sameSite:"lax"});
  return res.json({ message: "Logged out ",isLoggedIn : false });
});

module.exports = router;