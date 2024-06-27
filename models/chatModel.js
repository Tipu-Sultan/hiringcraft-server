const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
    {
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        messages: [
            {
                sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                message: { type: String },
                attachments: [String],
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;