import React, { useState, useRef } from 'react';

const MouseFollower = ({follower, children, offsetX, offsetY, follow, ...props}) => {
    const [position, setPosition] = useState({x: 0, y: 0});
    const [show, setShow] = useState(false);
    const divElement = useRef(null);

    const onMouseMove = (e) => {
        setPosition({x: e.pageX, y: e.pageY});
    };

    const onMouseEnter = (e) => {
        setShow(true);
    };

    const onMouseLeave = (e) => {
        setShow(False);
    };

    let followerDude = <span/>;
    if (show){
        let x = offsetX;
        let y = offsetY;
        if (follow){
            y += position.y;
            x += position.x;
            if (divElement.current){
                y -= divElement.current.offsetTop;
                x -= divElement.current.offsetLeft;
            }
        }
        
        followerDude = (
            <div style={{position:"absolute", bottom:y, left:x}}>
                {follower}
            </div>
        );
    }
    return (
        <div ref={divElement} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} 
            {...props} style={{position:"relative"}}>
            {followerDude} 
            {children}
        </div> 
    );
};

MouseFollower.defaultProps = {
    follow: true,
    offsetX: 10,
    offsetY: 10
};

export default MouseFollower;
