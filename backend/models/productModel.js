import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startingBid: {
            type: Number,
            required: true,
        },
        currentBid: {
            type: Number,
            default: 0,
        },
        bidIncrement: {
            type: Number,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        seller: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
        },
        bids: [
            {
                bidder: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "User", 
                    required: true,
                },
                bidAmount: {
                    type: Number,
                    required: true,
                },
                bidTime: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export { Product };
