

import mongoose from "mongoose";
import { generateListingSearchData } from "../utils/keywordGenerator.js";
const ListingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            required: false,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        bathrooms:{
            type: Number,
            required: true,
        },
        area:{
            type: Number,
            required: true,
        },
        furnished: {
            type: Boolean,
            required: true,
        },
        parking:{
            type: Boolean ,
            required : true ,
        }, 
        type: { 
            type: String,
            enum: ['rent', 'sell'],
            required: true
        },
        category: {
  type: String,
  enum: [
    "فيلا",
    "شقة",
    "تاون هاوس",
    "دوبلكس",
    "بنتهاوس",
    "مكتب",
    "محل تجاري",
    "أرض",
  ],
  required: true,
},
        offer: {
            type: Boolean,
            required: true,
        },
        status: {
  type: String,
  enum: ["available", "sold", "rented"],
  default: "available",
},
        imageUrl: [
            {url: { type: String, required: true }, public_id: { type: String, required: true }}
        ],
        userRef:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, searchKeywords: {
            type: [String],
            default: [],
            index: true,
        },
        resolvedLocation: {
            type: String,
            default: null,
            index: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },


    }, { timestamps: true });
ListingSchema.index({ resolvedLocation: 1, type: 1 });
ListingSchema.index({ type: 1, price: 1 });
ListingSchema.index({ featured: -1, createdAt: -1 });
ListingSchema.index({ category: 1, price: 1 });
ListingSchema.index({ status: 1 });

ListingSchema.pre("save", function () {
    const relevantFieldsChanged = ["name", "description", "address"].some((f) =>
        this.isModified(f)
    );

    if (this.isNew || relevantFieldsChanged) {
        const { searchKeywords, resolvedLocation } = generateListingSearchData({
            name: this.name,
            description: this.description,
            address: this.address,
        });

        this.searchKeywords = searchKeywords;
        this.resolvedLocation = resolvedLocation;
    }
});
 
ListingSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate();
    const touchesRelevantField = ["name", "description", "address"].some(
        (f) => update[f] !== undefined || update.$set?.[f] !== undefined
    );

    if (!touchesRelevantField) return ;

    const existing = await this.model.findOne(this.getQuery());
    if (!existing) return ;

    const merged = {
        name: update.name ?? update.$set?.name ?? existing.name,
        description: update.description ?? update.$set?.description ?? existing.description,
        address: update.address ?? update.$set?.address ?? existing.address,
    };

    const { searchKeywords, resolvedLocation } = generateListingSearchData(merged);
    this.setUpdate({ ...update, searchKeywords, resolvedLocation });
   
});
const Listing = mongoose.model("Listing", ListingSchema);
    export default Listing;