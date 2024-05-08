import express  from "express";
import { getAllProblems,addProblem,getTypeProblems,getAllTypes,getStatCount,toFavourites, toComplete} from "../controllers/problemController.js";
const problemRouter=express.Router()

problemRouter.route('/').get(getAllProblems).post(addProblem)
problemRouter.post('/toFav/:id',toFavourites)
problemRouter.post('/toComplete/:id',toComplete)
problemRouter.get('/statcount',getStatCount)
problemRouter.get('/typeProblems/:type',getTypeProblems)
problemRouter.get('/alltype',getAllTypes)

export default problemRouter