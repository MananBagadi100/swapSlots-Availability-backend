const db = require("../config/db");

//Get swappable slots from other users only
exports.getSwappableSlots = async (req, res) => {
    try {
        const [slots] = await db.query(
            "SELECT e.*, u.name AS ownerName FROM events e JOIN users u ON e.userId = u.id WHERE e.status = 'SWAPPABLE' AND e.userId != ?",
            [req.user.id]
        );
        res.json(slots);
    } 
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//Get my own (user's own) swappable slots
exports.getMySwappableSlots = async (req,res) => {
    try {
        const [slots] = await db.query(
        "SELECT * FROM events WHERE userId = ? AND status = 'SWAPPABLE' ORDER BY startTime ASC",
        [req.user.id]
        );
        res.json(slots);
    }
    catch (err) {
        res.stats(500).json({
            message: err.message
        })
    }
}

//Get all the swapping requests you have received
exports.getIncomingRequests = async (req, res) => {
    try {
        const [requests] = await db.query(
            `SELECT sr.id AS requestId, 
              u.name AS requesterName,
              e1.title AS requesterSlot,
              e2.title AS yourSlot,
              sr.status
       FROM swap_requests sr
       JOIN users u ON sr.requesterId = u.id
       JOIN events e1 ON sr.mySlotId = e1.id
       JOIN events e2 ON sr.theirSlotId = e2.id
       WHERE sr.responderId = ?`,
            [req.user.id]
        );

        res.json(requests);
    } 
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//Get all the swapping requests which the user has receieved
exports.getOutgoingRequests = async (req, res) => {
    try {
        const [requests] = await db.query(
            `SELECT sr.id AS requestId, 
              u.name AS responderName,
              e1.title AS mySlot,
              e2.title AS theirSlot,
              sr.status
       FROM swap_requests sr
       JOIN users u ON sr.responderId = u.id
       JOIN events e1 ON sr.mySlotId = e1.id
       JOIN events e2 ON sr.theirSlotId = e2.id
       WHERE sr.requesterId = ?`,
            [req.user.id]
        );
        res.json(requests);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//Create a swap request
exports.requestSwap = async (req, res) => {
    try {
        const {mySlotId,theirSlotId} = req.body;

        // Check both slots are SWAPPABLE
        const [mySlot] = await db.query(
            "SELECT * FROM events WHERE id = ? AND userId = ? AND status = 'SWAPPABLE'",
            [mySlotId, req.user.id]
        );
        const [theirSlot] = await db.query(
            "SELECT * FROM events WHERE id = ? AND status = 'SWAPPABLE'",
            [theirSlotId]
        );

        if (mySlot.length === 0 || theirSlot.length === 0) {
            return res.status(400).json({
                message: "One of the slots is not swappable anymore"
            });
        }
        const responderId = theirSlot[0].userId;
        // Create request
        await db.query(
            "INSERT INTO swap_requests (requesterId, responderId, mySlotId, theirSlotId) VALUES (?, ?, ?, ?)",
            [req.user.id, responderId, mySlotId, theirSlotId]
        );

        // Set both events as pending
        await db.query(
            "UPDATE events SET status = 'SWAP_PENDING' WHERE id IN (?, ?)",
            [mySlotId, theirSlotId]
        );
        res.json({message: "Swap request sent ✅"});
    } 
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// 3) Respond to swap request (accept / reject)
exports.respondSwap = async (req, res) => {
    try {
        const {requestId} = req.params;
        const {accepted} = req.body;

        // Fetch request
        const [reqData] = await db.query(
            "SELECT * FROM swap_requests WHERE id = ? AND responderId = ?",
            [requestId, req.user.id]
        );
        if (reqData.length === 0) return res.status(400).json({
            message: "Request not found"
        });

        const request = reqData[0];

        if (!accepted) {
            // If rejected then revert status of that event
            await db.query("UPDATE events SET status = 'SWAPPABLE' WHERE id IN (?, ?)", [
                request.mySlotId,
                request.theirSlotId,
            ]);
            await db.query("UPDATE swap_requests SET status = 'REJECTED' WHERE id = ?", [requestId]);
            return res.json({
                message: "Swap rejected !"
            });
        }

        // If accepted then swap owners of that event
        const [slotA] = await db.query("SELECT userId FROM events WHERE id = ?", [request.mySlotId]);
        const [slotB] = await db.query("SELECT userId FROM events WHERE id = ?", [request.theirSlotId]);

        await db.query("UPDATE events SET userId = ? , status = 'BUSY' WHERE id = ?", [slotB[0].userId, request.mySlotId]);
        await db.query("UPDATE events SET userId = ? , status = 'BUSY' WHERE id = ?", [slotA[0].userId, request.theirSlotId]);
        //updating status after swap
        await db.query("UPDATE swap_requests SET status = 'ACCEPTED' WHERE id = ?", [requestId]);

        res.json({message: "Swap accepted ✅"});

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};