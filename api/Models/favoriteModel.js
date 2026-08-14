import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    listingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

FavoriteSchema.index(
  { userRef: 1, listingRef: 1 },
  { unique: true }
);

FavoriteSchema.index({ listingRef: 1 });
FavoriteSchema.index({ userRef: 1 });

export default mongoose.model("Favorite", FavoriteSchema);