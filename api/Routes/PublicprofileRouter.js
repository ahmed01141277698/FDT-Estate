import express from "express";
import { getPublicProfile } from "../Controllers/puplicprofileControlle.js";

const PublicProfileRouter = express.Router();

PublicProfileRouter.get("/:id/public", getPublicProfile);

export default PublicProfileRouter;
