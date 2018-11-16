import React from 'react';

class MouseFollower extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            followerX: 0,
            followerY: 0,
        };
    }

    static defaultProps = {
        offsetX: 10,
        offsetY: 10
    };

    onMouseMove = (e) => {
        this.setFollowerXY(e.pageX, e.pageY);
    };

    onMouseEnter = (e) => {
        this.setState({show: true});
    };

    onMouseLeave = (e) => {
        this.setState({show: false});
    };

    setFollowerXY = (x, y) => {
        this.setState(state => ({
            followerY: y,
            followerX: x
        }));
    }

    render () {
        let {follower, children, offsetX, offsetY, ...props} = this.props;

        let followerDude = <span/>;
        if (this.state.show){
            followerDude = (
                <div style={{position:"absolute", top:this.state.followerY + offsetY, left:this.state.followerX + offsetX}}>
                    {follower}
                </div>
            );
        }
        return (
            <div onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} 
                {...props}>
                {followerDude} 
                {children}
            </div> 
        );
    }
}

module.exports = MouseFollower;
