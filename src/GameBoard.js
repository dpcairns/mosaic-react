import React, { Component } from 'react'
import { getInitGameState } from './helper.js';
import { getScheme, getBoards } from './mosaic-api.js';
import BottomDrawer from './BottomDrawer.js';
import { withRouter } from 'react-router-dom';
import TopDrawer from './TopDrawer.js';
import MosaicTitle from './MosaicTitle.js';
import audioStart, { playAudio, stopAudio, muteAudio } from './audio.js';
import MusicDrawer from './MusicDrawer.js';
import { getInitPlaybackState } from './helper.js';


export default withRouter (class GameBoard extends Component {


    componentDidMount = async () => {
        const schemeArray = await getScheme(this.props.startColor, this.props.mode);
        clearInterval(this.props.playInt);

        if (this.props.match.params.id) {
            if (this.props.match.params.id === '$$$') {
                this.props.setAppState({
                    schemeArray: schemeArray,
                    gameboard: this.props.gameboard,
                    startColor: this.props.startColor,
                    musicboard: this.props.musicboard,
                    colorName: this.props.colorName,
                    isPlaying: false
                })
            } else {

                try {
                    const userBoards = await getBoards(this.props.user);
                    userBoards.body.forEach(userBoard => {
                        if (userBoard.id === Number(this.props.match.params.id)) {
                            const boardParse = JSON.parse(userBoard.game_board);
                            const schemeParse = JSON.parse(userBoard.scheme);
                            const musicParse = JSON.parse(userBoard.music_board);
                            this.props.setAppState({ 
                                gameboard: boardParse,
                                schemeArray: schemeParse,
                                id: this.props.match.params.id,
                                musicboard: musicParse,
                                colorName: userBoard.board_name,
                                isPlaying: false
                            });
                        }
                    })
                    
                } catch (err) {
                    return;
                }
            }
        } else {
            this.props.setAppState({
                schemeArray: schemeArray,
                gameboard: getInitGameState(), 
                startColor: this.props.startColor,
                musicboard: getInitGameState(),
                colorName: this.props.colorName,
                isPlaying: false
            })
        }
        audioStart();
    }

    handleClick = (e) => {
        const cellId = e.target.id
        if (!cellId.includes('cell')) return;
        
        const idArray = cellId.split('_')[1].split('-');
        const newBoard = this.props.gameboard.slice();
        const newMusic = this.props.musicboard.slice();

        const randomColor = Math.floor(Math.random() * this.props.schemeArray.length);
       
        newBoard[Number(idArray[0])][Number(idArray[1])] = this.props.startColor;
        newMusic[Number(idArray[0])][Number(idArray[1])] = this.props.lastRandomNote;
        
        this.props.setAppState({
            startColor: this.props.schemeArray[randomColor],
            gameboard: newBoard,
            musicboard: newMusic,
            lastRandomNote: randomColor
        })
        playAudio(this.props.lastRandomNote);
    }

    getSaved = (newState) => {
        const boardParse = JSON.parse(newState.game_board);
        const schemeParse = JSON.parse(newState.scheme);
        const musicParse = JSON.parse(newState.music_board);
        this.setAppState({ 
            gameboard: boardParse,
            schemeArray: schemeParse,
            id: newState.id,
            musicboard: musicParse
        });
    }

    handleChangeScheme = async(e) =>  {
        const schemeArray = await getScheme(this.props.startColor, e.target.value)
        this.props.setAppState({
            schemeArray: schemeArray,
            mode: e.target.value
        })
        console.log('scheme', this.props.schemeArray)
    }

    // this function does a lot of work, and it would be really hard to maintain if i were a dev walking into this project. it would be a good idea to refactor with specific names and comments to clarify what's happening here and why
    handlePlay = () => {
        clearInterval(this.props.playInt)

        let countArray = [0, 0]    
        const mapOver = this.props.gameboard;
        let blankBoard = getInitPlaybackState();

        this.props.setAppState({ 
            gameboard: this.props.gameboard,
            playbackMap: mapOver,
            isPlaying: true })
        let playTime = setInterval(() => {
            // this could use some comments or helpful storing of values in consts, like
            const savedNote = this.props.musicboard[countArray[0]][countArray[1]];
            if (!isNaN(savedNote)) {
                playAudio(savedNote);
            }
            blankBoard[countArray[0]][countArray[1]] = mapOver[countArray[0]][countArray[1]];
            this.props.setAppState({gameboard: blankBoard})
            if (countArray[1] < this.props.gameboard[0].length - 1) {
                countArray[1]++;
            } else if (countArray[0] < this.props.gameboard.length - 1) {
                countArray[1] = 0;
                countArray[0]++;
            } else {
                countArray = [0, 0];

                this.props.setAppState({ isPlaying: false}); 
                clearInterval(this.props.playInt);
            }
        }, this.props.playbackSpeed);
        this.props.setAppState({ playInt: playTime});  
    }

    handlePlaybackSpeed = (newSpeed) => {
        this.props.setAppState({ 
            playbackSpeed: newSpeed,
            gameboard: this.props.playbackMap,
            isPlaying: false
        });  
        clearInterval(this.props.playInt);
    }

    handleMute = () => {
        this.props.setAppState({ 
            isMuted: !this.props.isMuted
        })
        muteAudio(this.props.isMuted)
    }

    handleStop = () => {
        clearInterval(this.props.playInt)
        this.props.setAppState({ 
            gameboard: this.props.playbackMap,
            isPlaying: false
        })
    }

    componentWillUnmount() {
        stopAudio();
        // awesome interval clearin' on unmount!
        clearInterval(this.props.playInt)
    }

    render() {
        
       
        const rowNodes = getInitGameState().map((rows, i) => {
            const cellNodes = getInitGameState()[0].map((cell, j) => {
                return <div className="cell" key={`cellKey_${i}-${j}`}style={{backgroundColor: this.props.gameboard[i][j]}} id={`cell_${i}-${j}`}></div>
            })
            return (<div className="row" key={`rowKey_${i}`}id={`row_${i}`}>{cellNodes}</div>)
        })
    
        const background = {backgroundColor: this.props.bgColor}
        return (

            <div style={background} id="gameboard-app">
                <div id="gameboard-parent">
                    
                    <MosaicTitle schemeArray={this.props.schemeArray} />
                    <div id="gameboard-container" onClick= { this.handleClick }>
                        {rowNodes}
                    </div>
                    <div id="preview-container">
                        <div id="tile-preview" style={{backgroundColor: this.props.startColor}}>
                        </div>
                    </div>
                </div>

            
            // way easier to read with the props line up like so
                <BottomDrawer id={this.props.id}
                    currentMusic={this.props.musicboard}
                    getSaved={() => this.getSaved}
                    scheme={this.props.schemeArray}  
                    history={this.props.history}  
                    colorName={this.props.colorName}  
                    handleChangeScheme={this.handleChangeScheme}  
                    gameState={this.props.gameboard}
                    user={this.props.user}>

                </BottomDrawer>
                <MusicDrawer play={this.handlePlay}
                    stop={this.handleStop}
                    isPlaying={this.props.isPlaying}
                    playbackSpeed={this.props.playbackSpeed}
                    handlePlaybackSpeed={this.handlePlaybackSpeed}
                    isMuted={this.props.isMuted}
                    handleMute={this.handleMute}/>
                <TopDrawer user={this.props.user}/>

            </div>
        )
    }
})
