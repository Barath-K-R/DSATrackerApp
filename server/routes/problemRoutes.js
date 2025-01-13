import express from 'express'
import * as problemController from '../controllers/problemController.js';

const problemRoutes=express.Router();

problemRoutes.post('/',problemController.createProblem)
problemRoutes.get('/',problemController.getAllProblems)
problemRoutes.delete('/:id', problemController.deleteProblem);
problemRoutes.post('/type', problemController.createProblemType);
problemRoutes.get('/type', problemController.getAllProblemTypes);

problemRoutes.get('/stats',problemController.getProblemStats)
problemRoutes.patch('/move', problemController.moveProblem);
problemRoutes.patch('/:id/favourite', problemController.updateIsFavourite);
problemRoutes.patch('/:id/completed', problemController.updateIsCompleted);




export default problemRoutes;