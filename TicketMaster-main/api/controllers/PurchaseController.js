const express = require('express');
const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/create', async (req, res) => {
  const { allPurchases } = req.body;

  try {
    for (const purchase of allPurchases) {
      const purchaseModel = new Purchase({
        userId: purchase.userId,
        ticketId: purchase.ticketId,
        date: purchase.date,
        paymentType: purchase.paymentType
      });

      const ticket = await Ticket.findById(purchase.ticketId);

      if (!ticket) {
        return res.status(404).json({
          error: true,
          message: `Ticket ${purchase.ticketId} not found`,
          result: {}
        });
      }

      if (ticket.remaining > 0) {
        ticket.remaining -= 1;
        await ticket.save();
        console.log(`Ticket ${ticket._id} updated`);
      } else {
        return res.status(401).json({
          error: true,
          message: `No remaining tickets for ${purchase.ticketId}`,
          result: {}
        });
      }

      await purchaseModel.save();
    }

    return res.status(200).json({
      error: false,
      message: "Success creating purchases",
      result: {}
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
      result: {}
    });
  }
});


router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const purchases = await Purchase.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'Tickets',
          localField: 'ticketId',
          foreignField: '_id',
          as: 'ticketDetails'
        }
      },
      {
        $unwind: '$ticketDetails'
      },
      {
        $project: {
          _id: 0,
          eventName: '$ticketDetails.name',
          purchaseDate: '$date',
          eventDate: '$ticketDetails.eventDate'
        }
      }
    ]);
    res.json({
      error: false,
      message: "Success get purchases",
      result: { purchases }
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
