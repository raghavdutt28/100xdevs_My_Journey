import React, { forwardRef, useState } from 'react'

const SubBoxes = forwardRef(({ onDone, goBack }, ref) => {
    const [inputBoxValue, setInputBoxValue] = useState("");
    return (
        <span>
            <input
                className='text-white w-[40px] h-[50px] px-4 outline-none bg-blue-500 rounded-xl'
                type="text"
                maxLength={1}
                value={inputBoxValue}
                ref={ref}
                onKeyDown={(e) => {
                    if (e.key == "Backspace") {
                        setInputBoxValue("");
                        goBack();
                    }
                }}
                onChange={(e) => {
                    if(e.target.value.charCodeAt() <= 57 && e.target.value.charCodeAt() >= 48 ){
                        setInputBoxValue(e.target.value);
                        onDone();
                    } else {

                    }
                }}
            />
        </span>
    );
});

export default SubBoxes