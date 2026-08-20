import { Router } from "express";
import { toggleVote, getVotes } from "../controllers/vote.controller";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { toggleVoteSchema } from "@/validations/vote.schemas";
import { listVotesQuerySchema } from "@/validations/vote.schemas";

const voteRoutes = Router();

voteRoutes
  .route("/")
  .get(validateQuery(listVotesQuerySchema), getVotes)
  .post(validate(toggleVoteSchema), toggleVote);

export default voteRoutes;
