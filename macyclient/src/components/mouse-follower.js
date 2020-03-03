import React from 'react';

export default class MouseFollower extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            followerX: 0,
            followerY: 0,
        };
    }

    static defaultProps = {
        follow: true,
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
        let {follower, children, offsetX, offsetY, follow, ...props} = this.props;

        let followerDude = <span/>;
        if (this.state.show){
            let x = offsetX;
            let y = offsetY;
            if (follow){
                y += this.state.followerY;
                x += this.state.followerX;
                if (this.e){
                    y -= this.e.offsetTop;
                    x -= this.e.offsetLeft;
                }
            }
            
            followerDude = (
                <div style={{position:"absolute", bottom:y, left:x}}>
                    {follower}
                </div>
            );
        }
        return (
            <div ref={(e)=>{this.e = e}} onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} 
                {...props} style={{position:"relative"}}>
                {followerDude} 
                {children}
            </div> 
        );
    }
}
