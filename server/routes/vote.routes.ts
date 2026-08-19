import { Router } from "express";
import { toggleVote, getVotes } from "../controllers/vote.controller";
import { validate } from "../middleware/validation.middleware";
import { toggleVoteSchema } from "@/validations/vote.schemas";

const voteRoutes = Router();

voteRoutes
  .route("/")
  .get(getVotes)
  .post(validate(toggleVoteSchema), toggleVote);

export default voteRoutes;
