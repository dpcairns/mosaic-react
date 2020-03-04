import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppsIcon from '@material-ui/icons/Apps';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
// import createBrowserHistory from 'history/createBrowserHistory';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});
const storedUser = JSON.parse(localStorage.getItem('user'));

const SwipeableTemporaryDrawer = withRouter(({history, user}) => {
  const realUser = user ? user : storedUser;


  const classes = useStyles();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    logBool: true,
  });

  const toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [side]: open });
  };

  const handleMyBoards = () => history.push('/userboards');
  const handleLoginButton = () => history.push('/login');
  const handleLogoutButton = () => {
    localStorage.clear();
    history.push('/login');
  };

  const button = () => (!realUser) ? 
    <Button variant="contained" size="small" color="secondary" onClick={e => handleLoginButton()} startIcon={<AccountCircleIcon/>}>Login</Button> : <div>
    <em>{realUser.name}</em>
    <Button variant="contained" size="small" color="secondary" onClick={e => handleLogoutButton()} startIcon={<AccountCircleIcon/>}>Logout</Button>
  </div>
  ;

  const fullList = side => (
    <div className={classes.fullList} id="top-drawer-contents" role="presentation" onClick={toggleDrawer(side, false)} onKeyDown={toggleDrawer(side, false)}>

      

      {button()}
      <Button variant="contained" size="small" color="primary" onClick={e => handleMyBoards()} startIcon={<SubscriptionsIcon/>}>My Mosaics</Button>
      <Button variant="contained" size="small" color="primary" onClick={e => history.push('/')} startIcon={<AddCircleIcon/>}>New Mosaic</Button>
    </div>
  );

  return (
    <div id="top-drawer-div">
      <Button onClick={toggleDrawer('top', true)} size="large" startIcon={<AppsIcon/>}></Button>
      
      <SwipeableDrawer anchor="top" open={state.top} onClose={toggleDrawer('top', false)} onOpen={toggleDrawer('top', true)}>{fullList('top')}</SwipeableDrawer>
    </div>
  );
})

export default SwipeableTemporaryDrawer;