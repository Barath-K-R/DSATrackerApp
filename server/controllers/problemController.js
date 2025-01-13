import Problem from '../models/ProblemModel.js';
import ProblemType from '../models/ProblemType.js';
import Solution from '../models/SolutionModel.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

export const createProblem = asyncErrorHandler(async (req, res) => {
    const { name, type, difficulty, link } = req.body;

    const existingProblem = await Problem.findOne({ name });
    if (existingProblem) {
        throw new CustomError('Problem already exists', 400);
    }

    const newProblem = new Problem({
        name,
        type,
        difficulty,
        link
    });

    await newProblem.save();

    res.status(201).json({
        message: 'Problem created successfully',
        problem: newProblem,
    });
});

export const createProblemType = asyncErrorHandler(async (req, res) => {
    const { name, description } = req.body;

    const existingProblemType = await ProblemType.findOne({ name });
    if (existingProblemType) {
        throw new CustomError('Problem type already exists', 400);
    }

    const problemType = new ProblemType({
        name,
        description,
    });

    await problemType.save();

    res.status(201).json({ message: 'Problem type created successfully', problemType });
});

export const getAllProblemTypes = asyncErrorHandler(async (req, res) => {
    const problemTypes = await ProblemType.find();
    res.status(200).json({ problemTypes });
});

export const getAllProblems = asyncErrorHandler(async (req, res) => {
    const problems = await Problem.find().populate('type', 'name description');
    res.status(200).json({ problems });
});

export const updateIsFavourite = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const problem = await Problem.findById(id);

    if (!problem) {
        throw new CustomError('Problem not found', 404);
    }

    problem.isFavourite = !problem.isFavourite;
    await problem.save();

    res.status(200).json({ message: 'isFavourite updated successfully', problem });
});

export const updateIsCompleted = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const problem = await Problem.findById(id);

    if (!problem) {
        throw new CustomError('Problem not found', 404);
    }

    problem.isCompleted = !problem.isCompleted;
    await problem.save();

    res.status(200).json({ message: 'isCompleted updated successfully', problem });
});

export const deleteProblem = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
        throw new CustomError('Problem not found', 404);
    }

    const problemsRemaining = await Problem.countDocuments({ type: deletedProblem.type });

    if (problemsRemaining === 0) {
        await ProblemType.findByIdAndDelete(deletedProblem.type);
    }

    res.status(200).json({ message: 'Problem deleted successfully' });
});

export const moveProblem = asyncErrorHandler(async (req, res) => {
    const { problemId, newType } = req.body;

    if (!problemId || !newType) {
        throw new CustomError('Problem ID and new type are required', 400);
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new CustomError('Problem not found', 404);
    }

    const problemTypeExists = await ProblemType.findOne({ name: newType });
    if (!problemTypeExists) {
        throw new CustomError('Target problem type does not exist', 404);
    }

    problem.type = problemTypeExists._id;
    await problem.save();

    res.status(200).json({ message: 'Problem moved successfully', problem });
});

export const getProblemStats = asyncErrorHandler(async (req, res) => {
    const stats = await Problem.aggregate([
        {
            $group: {
                _id: "$difficulty",
                total: { $sum: 1 },
                completed: { $sum: { $cond: ["$isCompleted", 1, 0] } },
            },
        },
        {
            $project: {
                difficulty: "$_id",
                total: 1,
                completed: 1,
                _id: 0,
            },
        },
    ]);

    const formattedStats = {
        easy: { total: 0, completed: 0 },
        medium: { total: 0, completed: 0 },
        hard: { total: 0, completed: 0 },
    };

    stats.forEach((stat) => {
        formattedStats[stat.difficulty.toLowerCase()] = {
            total: stat.total,
            completed: stat.completed,
        };
    });

    res.status(200).json(formattedStats);
});
