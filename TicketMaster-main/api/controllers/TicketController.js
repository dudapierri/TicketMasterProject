const express = require('express')
const Ticket = require('../models/Ticket')
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/create', upload.single('image'), async (req, res) => {
    const { title, description, address, eventDate, name, email, price, capacity } = req.body;
    const imageBuffer = req.file.buffer;
    const ticket = new Ticket({
        title,
        image64: imageBuffer,
        description,
        address,
        eventDate,
        name,
        email,
        price,
        capacity,
        remaining: capacity
    });
    await ticket.save((error, ticket) => {
        if (error) {
            return res.status(501).json({
                error: true,
                message: error.message,
                result: {}
            });
        }
        return res.status(200).json({
            error: false,
            message: "Success creating ticket",
            result: { ticket }
        })
    })
});

router.put("/update/:id", upload.single('image'), async (req, res) => {
    const { title, description, address, eventDate, name, email, price, capacity } = req.body;
    const imageBuffer = req.file.buffer;
    let ticket = { title, image64: imageBuffer, description, address, eventDate, name, email, price, capacity };
    Ticket.findByIdAndUpdate({ _id: req.params.id }, ticket, { new: true }).exec(
        (error, value) => {
            if (error) {
                res.status(501).json({
                    error: true,
                    message: error.message,
                    result: {}
                });
            } else {
                res.status(201).json({
                    error: false,
                    message: "Success put tickets",
                    result: { ticket: value }
                });
            }
        })
});

router.get("/:id", async (req, res) => {
    Ticket.findById(req.params.id).exec((err, ticket) => {
        if (err) {
            res.status(204).send({
                error: true,
                message: "Cannot find a Ticket",
                result: {}
            });
        } else {
            if (ticket == null) {
                return res.status(404).json({
                    error: true,
                    message: "Cannot find a Ticket",
                    result: {}
                });
            }
            res.status(201).json({
                error: false,
                message: "Success get ticket",
                result: { ticket }
            });
        }
    })
});



router.delete("/delete/:id", async (req, res) => {
    //await sendEmailToUsers();
    Ticket.findByIdAndDelete({ _id: req.params.id }, (err, ticket) => {
        if (err) {
            res.status(501).json({
                error: true,
                message: "Failed to delete ticket",
                result: {}
            });
        } else {
            res.status(201).json({
                error: false,
                message: "Ticket deleted",
                result: { ticket }
            });
        }
    })
});

router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json({
            error: false,
            message: "Success get tickets",
            result: { tickets }
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
            result: {}
        });
    }
});


module.exports = router;
