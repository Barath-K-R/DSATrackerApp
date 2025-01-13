import express from 'express'
import * as solutionController from '../controllers/solutionController.js'

const solutionRouter=express.Router();

solutionRouter.get('/', solutionController.getSolutionsByProblemName);
solutionRouter.post('/', solutionController.addSolution);
solutionRouter.delete('/:solutionId',solutionController.deleteSolution)

export default solutionRouter;