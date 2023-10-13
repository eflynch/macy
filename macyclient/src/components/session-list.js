import React from 'react';

const SessionListItem = ({name, serializedData}) => {
    return (
        <li>{name}</li>
    );
};

const CurrentListItem = (props) => {
    return <li>Modified</li>;
};

export default function SessionList({sessionList, dirtyFlag}) {
    const dirtyFlagItem = dirtyFlag ? <CurrentListItem/> : <span/>;
    return (
        <div>
            {sessionList.map((session)=><SessionListItem key={session.name} {...session}/>)}
            {dirtyFlagItem}
        </div>
    );
};
