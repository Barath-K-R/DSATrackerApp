import asyncHandler from 'express-async-handler'
import ProblemModel from '../models/problemModel.js'
import problemModel from '../models/problemModel.js'
export const getAllProblems=asyncHandler(async(req,res)=>{
        try {
            const problems=await problemModel.find();
            const result = await problemModel.aggregate([
                {
                  $group: {
                    _id: '$type', 
                    totalProblems: { $sum: 1 }, 
                    completedProblems: { $sum: { $cond: { if: '$isCompleted', then: 1, else: 0 } } } // Count completed problems for each type
                  }
                }
              ]);
              res.status(200).json({problems:problems,group:result})
        } catch (error) {
            console.log(error)
        }
        
   
})

export const addProblem=asyncHandler(async(req,res)=>{
   //checking if the type already exists
   console.log('creating problem')
   console.log(req.body)
   try {
        const newProblem=new ProblemModel(req.body)
        await newProblem.save()
        res.send(newProblem)
   } catch (error) {
        console.log(error)
   }
    
   
});

export const getTypeProblems=asyncHandler(async(req,res)=>{
    console.log('get type problems')
    const searchBy=req.query.searchBy
    const query=req.params
    console.log(searchBy)
    try {
        const problemslist=await ProblemModel.find({[searchBy]:query.type})
        res.send(problemslist)
    } catch (error) {
        console.log(error)
    }
    
    
})

export const getAllTypes=async(req,res)=>{
    console.log('getting all types')
    try {
        const types=await problemModel.distinct('type');
        res.send(types)
    } catch (error) {
        console.log(error)
    }
}

export const getStatCount=async(req,res)=>{
   
      try {
        console.log('stat count')
        const countsByDifficulty = await problemModel.aggregate([
            {
              $group: {
                _id: { $toLower: '$difficulty' },
                total: { $sum: 1 },
                completed: { $sum: { $cond: { if: '$isCompleted', then: 1, else: 0 } } }
              }
            }
          ]);
          console.log(countsByDifficulty)
          res.json(countsByDifficulty)
      } catch (error) {
        console.log(error)
      }
}

export const toFavourites=async(req,res)=>{
  console.log('tofav')
    const problemId=req.params.id;
     try {
         const problem=await problemModel.findById(problemId)
         problem.isFavourite=!problem.isFavourite;
         await problem.save();
         res.send(problem)
     } catch (error) {
      console.log(error)
     }
}

export const toComplete=async(req,res)=>{
  console.log('completing')
  const problemId=req.params.id;
   try {
    const problem=await problemModel.findById(problemId)
    console.log(problem)
    problem.isCompleted=!problem.isCompleted;
    await problem.save();
    res.send(problem)
   } catch (error) {
    console.log(error)
   }
}