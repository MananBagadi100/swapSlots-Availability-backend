const db = require("../config/db");

//Getting logged-in user's events
exports.getMyEvents = async (req, res) => {
    try {
        const [events] = await db.query(
            "SELECT * FROM events WHERE userId = ? ORDER BY startTime ASC",
            [req.user.id]
        );
        res.json(events);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};{}
//Creating a new event
exports.createEvent = async (req, res) => {
    try {
        const {title,startTime,endTime} = req.body;

        await db.query(
            "INSERT INTO events (userId, title, startTime, endTime) VALUES (?, ?, ?, ?)",
            [req.user.id, title, startTime, endTime]
        );

        res.json({message: "Event created ✅"});
    } 
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//Change status BUSY to SWAPPABLE and vice versa
exports.updateStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        //query to update the status of event
        await db.query(
            "UPDATE events SET status = ? WHERE id = ? AND userId = ?",
            [status, id, req.user.id]
        );

        res.json({message: "Status updated ✅"});
    } 
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const {id} = req.params;

        await db.query("DELETE FROM events WHERE id = ? AND userId = ?", 
            [id,req.user.id]);

        res.json({
            message: "Event deleted"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};