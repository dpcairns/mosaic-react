import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import MusicOffIcon from '@material-ui/icons/MusicOff';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import FormControl from '@material-ui/core/FormControl';
import { Select, InputLabel, MenuItem } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

const SwipeableTemporaryDrawer = withRouter(({history, isMuted, play, stop, isPlaying, playbackSpeed, handlePlaybackSpeed}) => {


  const classes = useStyles();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    logBool: true,
  });

  const handleChange = (e) => {
    handlePlaybackSpeed(Number(e.target.value));
  };

  const toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [side]: open });
  };

  const handleMute = () => {
      console.log('MUTE!')
  }

  const button = () => (!isMuted) ? 
    <Button variant="contained" size="small" color="secondary" onClick={e => handleMute()} startIcon={<MusicNoteIcon/>}>Mute</Button> :
    <Button variant="contained" size="small" color="secondary" onClick={e => handleMute()} startIcon={<MusicOffIcon/>}>Unmute</Button>;

  const fullList = side => (
    <div className={classes.fullList} id="music-drawer-contents" role="presentation" onClick={toggleDrawer(side, false)} onKeyDown={toggleDrawer(side, false)}>

      

      {button()}
      <Button variant="contained" size="small" color="primary" onClick={e => play()} startIcon={<PlayArrowOutlinedIcon/>} disabled={isPlaying}>Play</Button>
      <Button variant="contained" size="small" color="primary" onClick={e => stop()} startIcon={<StopOutlinedIcon/>} disabled={!isPlaying}>Stop</Button>
          <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="select-label">Speed</InputLabel>
              <Select onChange={handleChange} labelId="select-label" id="select-outlined" value={playbackSpeed}>
                  <MenuItem value="1000">Slow</MenuItem>
                  <MenuItem value="500">Medium</MenuItem>
                  <MenuItem value="200">Fast</MenuItem>
              </Select>
          </FormControl>
      </div>
  );

  return (
    <div id="top-drawer-div">
      <Button id="musicDrawerButton" onClick={toggleDrawer('top', true)} size="large" startIcon={<MusicVideoIcon/>}></Button>
      
      <SwipeableDrawer anchor="bottom" open={state.top} onClose={toggleDrawer('top', false)} onOpen={toggleDrawer('top', true)}>{fullList('top')}</SwipeableDrawer>
    </div>
  );
})

export default SwipeableTemporaryDrawer;