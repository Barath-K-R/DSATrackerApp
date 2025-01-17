import React, { useState } from 'react';
import { FaLayerGroup, FaRandom } from "react-icons/fa";


const ToolBar = ({setGroupedView}) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className='w-full flex  items-center my-2 p-2 pr-4 rounded-sm bg-customGray'>
            <div className="search-problem w-full">
                <input
                    type="text"
                    placeholder='search'
                    className={`bg-customDark p-1 px-2 border border-blue-400 focus:border-blue-500 focus:outline-none focus:w-4/6 transition-all duration-300 ease-in-out ${focused ? 'w-7/12 transform' : 'w-3/12'}`}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </div>

            <div className="tools flex justify-between items-center gap-5 px-2">
                <div className="group-icon flex justify-center items-center w-12 h-8 rounded-2xl border-[3px] border-blue-500 hover:bg-blue-500 cursor-pointer"
                onClick={()=>setGroupedView(prev=>!prev)}>
                    <FaLayerGroup size={18} />
                </div>
                <div className="group-icon flex justify-center items-center w-12 h-8 bg-blue-500 rounded-lg  hover:bg-blue-400 cursor-pointer">
                    <FaRandom size={18} />
                </div>
            </div>
        </div>
    );
};

export default ToolBar;
