import React, { useState , useEffect, useContext } from 'react';
import './App.css';
import Post from './post'; 
import Profile from './profile'
import Imageupload from './imageUpload'; 
import {db, auth } from "./database";
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import { faCircleUser, faUser, faHouse, faMagnifyingGlass ,faBell, faUpload, faMessageDots,faGear, faRightToBracket ,faBars,faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import datacontext from './datacontext';



function App() {
  const profile_pic = useContext(datacontext);
  const [opensignin, setopensignin] = useState(false);
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [current_profile_pic,setcurrent_profile_pic] = useState("");
  const [uploader, setuploader] = useState(false);
  const [profile, setprofile] = useState(false);
  const [settings_box, setsettings_box] = useState(false);
  const [home, sethome] = useState(true);
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [user, setuser] = useState(null);
  const signup = (e) => {
    e.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setopen(false);
  }

  const signin = (e) => {
    e.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message))
    
    setopensignin(false);
  }

  useEffect(() =>  {
    const unsubscribe = auth.onAuthStateChanged((authUser) => { 

      if(authUser) {
        // console.log(authUser);console logging authuser
        setuser(authUser);
  
      }else{
        setuser(null);
      }

    })

    return () => {
      unsubscribe();
    }
  },[user, username])
  
  useEffect(() =>  {

    db
    .collection('posts')
    .orderBy("timestamp","desc")
    .onSnapshot((snapshot) => {
      setposts(snapshot.docs.map(doc => ({
        post:doc.data(),
        id:doc.id
      })))});
      console.log("adding element to likes");
    
        

  },[profile_pic])

 console.log(posts)
  
  
 
  
  return (
    <div className="app">
      
        <div className="nav">
        <FontAwesomeIcon className='home icon' onClick={()=> {
    sethome(true)
    setprofile(false)
  }}  icon={faHouse} />
        <FontAwesomeIcon className='user icon' onClick={()=> {
    setprofile(true)
    sethome(false)
  }} icon={faUser} />
        <FontAwesomeIcon className='search icon' icon={faMagnifyingGlass } />
        <FontAwesomeIcon className='notification icon' icon={faBell} />
        <FontAwesomeIcon onClick={() =>setuploader(true)} className='upload icon' icon={faUpload} />
        <FontAwesomeIcon className='settings icon' onClick={() =>setsettings_box(true)} icon={faGear} />
        </div>
     
      <Modal
      open={uploader} 
      onClose={() => setuploader(false)}
      >
      {
        user?.displayName&& uploader ? (
          <Imageupload user={user} username={user.displayName}/>
        ):
        (
          <h3 className='login_error'>Login to upload</h3>
        )
      }

      </Modal>

        <Modal
      open={settings_box} 
      onClose={() => setsettings_box(false)}
      >
        {user ? (
          <div className="app_logout_container">
        <Button className='auth_actions' onClick={() => auth.signOut()}>Log out</Button>
        </div>  
        
        ) : (
        <div className="app_login_container">
          <Button className='auth_actions'  onClick={() => setopen(true)}>SignUp</Button>
          <Button className='auth_actions'  onClick={() => setopensignin(true)}>Sign In</Button>

        </div>  
      ) }
      

      </Modal>

      <Modal 
      open={open} 
      onClose={() => setopen(false)}
      >
        
      {
         <form className='app_signup'>

          <h1>Sign up Page</h1>

          <input 
          type="text"
          placeholder='username'
          className='username input'
          value={username}
          onChange={(e) => setusername(e.target.value)} />

          <input 
          type="text"
          placeholder='email'
          className='email input'
          value={email}
          onChange={(e) => setemail(e.target.value)} />

          <input 
          type="password"
          placeholder='password'
          className='password input'
          value={password}
          onChange={(e) => setpassword(e.target.value)} />

          <button className='signup button' type='submit' onClick={signup}>Sign up</button>
         </form>
        
      } 
      
      </Modal>  
      
      <Modal 
      open={opensignin} 
      onClose={() => setopensignin(false)}
      >

      {
         <form className='app_signup'>

          <h1>Login Page</h1>

          <input 
          type="text"
          placeholder='email'
          className='email input'
          value={email}
          onChange={(e) => setemail(e.target.value)} />

          <input 
          type="password"
          placeholder='password'
          className='password input'
          value={password}
          onChange={(e) => setpassword(e.target.value)} />

          <button className='signin button' type='submit' onClick={signin}>Sign In</button>
         </form>
        
      } 
      
      </Modal>  

      <div className="app_header">
{/*   
        <img src="https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-instagram-icon-instagram-logo-instagram-text-icon-18.png" alt="instagram" className="app_header_img" /> */}

         <h1>Mehanth</h1> 

  
      </div> 
     
      <div className="Profile">

      {
        profile &&
      <Profile posts={posts} user={user} />

      }
      </div>


      <div className="app_posts">

      {      home && 
              posts.map(({post, id}) => (
                <Post postId={id} user={user} username={post.username}  imageurl={post.imageurl} caption={post.caption}  timestamp={post.timestamp} profile_pic={post.profile_pic} File_format={post.file_format}/>
              )
              )
      }
        
      </div>

    </div>

  ); 
  
}

export default App;
