import React, { useEffect } from 'react';
import { getProblemStats } from '../api/problemApi';
import { useProblemContext } from '../context/problemContext/problemContext';
import ProgressBar from './ProgressBar';

const MenuBar = () => {
    const { stats, dispatch } = useProblemContext();

    useEffect(() => {
        const fetchStats = async () => {
            const statsResponse = await getProblemStats();

            dispatch({ type: "SET_PROBLEM_STATS", payload: statsResponse.data });
        };
        fetchStats();
    }, []);

    // Helper function to calculate percentage
    const calculateCompletionPercentage = (completed, total) => {
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return percentage;
    };

    return (
        <div className='flex flex-col w-1/6 items-center bg-customGray w-72 h-screen rounded-md text-white'>
            <div className="title p-2 text-xl font-bold">
                <h1>Menu</h1>
            </div>
            <div className="stats flex flex-col items-center bg-customDark w-11/12 h-72 pt-4">
                <h1 className='text-white text-lg font-semibold'>Stats</h1>

                <div className="problem-typestats flex flex-col gap-4 w-full">

                    {/* Easy Progress */}
                    <div className="easy-type flex flex-col items-center gap-2 w-full">
                        <div className="type-count w-full h-6 flex justify-between items-center px-3">
                            <div className="type">
                                <h2 className='text-easy'>Easy</h2>
                            </div>
                            <div className="problem-count">
                                {stats?.easy?.completed}/{stats?.easy?.total}
                            </div>
                        </div>
                        <ProgressBar
                            color={"easy"}
                            width={calculateCompletionPercentage(stats?.easy?.completed, stats?.easy?.total)}
                        />
                    </div>

                    {/* Medium Progress */}
                    <div className="medium-type flex flex-col items-center gap-2 w-full">
                        <div className="type-count w-full h-6 flex justify-between items-center px-3">
                            <div className="type">
                                <h2 className='text-medium'>Medium</h2>
                            </div>
                            <div className="problem-count">
                                {stats?.medium?.completed}/{stats?.medium?.total}
                            </div>
                        </div>
                        <ProgressBar
                            color="medium"
                            width={calculateCompletionPercentage(stats?.medium?.completed, stats?.medium?.total)}
                        />
                    </div>

                    {/* Hard Progress */}
                    <div className="hard-type flex flex-col items-center gap-2 w-full">
                        <div className="type-count w-full h-6 flex justify-between items-center px-3">
                            <div className="type">
                                <h2 className='text-hard'>Hard</h2>
                            </div>
                            <div className="problem-count">
                                {stats?.hard?.completed}/{stats?.hard?.total}
                            </div>
                        </div>
                        <ProgressBar
                            color="hard"
                            width={calculateCompletionPercentage(stats?.hard?.completed, stats?.hard?.total)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuBar;
