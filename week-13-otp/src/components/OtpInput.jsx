import React, { useRef } from 'react'
import SubBoxes from './SubBoxes'

const OtpInput = ({ number }) => {
    const refArray = useRef(Array(number).fill(null));
    return (
        <div className='flex gap-2 justify-center'>
            {
                refArray.current.map((x, index) =>
                    <SubBoxes
                        key={index}
                        ref={(el) => { refArray.current[index] = el }}
                        onDone={() => {
                            console.log("in on done");
                            if (index + 1 < number && refArray.current[index + 1]) {
                                refArray.current[index + 1].focus();
                            }
                        }}
                        goBack={() => {
                            console.log("in go back");
                            if (index > 0 && refArray.current[index - 1]) {
                                refArray.current[index - 1].focus();
                            }
                        }}
                    />
                )
            }
        </div>
    )
}

export default OtpInput