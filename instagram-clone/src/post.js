import React, { useEffect, useRef, useState } from 'react';
import './Post.css';
import { db} from './database';
import firebase from "firebase/compat/app";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "firebase/compat/firestore";
import { getDocs ,deleteDoc ,query, where , collection ,doc} from "firebase/firestore";
import { faHeart,faCircleUser, faUser, faHouse, faMagnifyingGlass ,faBell, faUpload, faMessageDots,faGear, faRightToBracket ,faBars,faArrowRight ,faStar,faComment, faShareNodes} from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';


function Post({postId, user, username ,imageurl, caption, timestamp,profile_pic, File_format}) { 

const [comments, setcomments] = useState([]);
const [comment, setcomment] = useState('');
const [file_format, setfile_format] = useState('');
const [likes, set_likes] = useState([]);
let no_likes = likes.length;
const [liked, setliked] = useState(false);
const [menu, setmenu] = useState(false);
const [filename,setfilename] = useState("");
const [TimeElapsed, setTimeElapsed] = useState();
const [profile_picture, setprofile_picture] = useState("");
var false_count = [];
// console.log(profile_pic,postId)
console.log("posts");

useEffect(() => {
  setprofile_picture(profile_pic)
},[])

useEffect(() => {
  setfile_format(File_format);
  const updateElapsedTime = () => {
    const postTime = timestamp; 
    const currentTime =firebase.firestore.Timestamp.now();
    
    const timeDifference = currentTime.seconds - postTime?.seconds  ;

    const seconds = Math.floor(timeDifference);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let elapsed = '';
    if (days > 0) {
      elapsed = `${days} days ago`;
    } else if (hours > 0) {
      elapsed = `${hours} hours ago`;
    } else if (minutes > 0) {
      elapsed = `${minutes} minutes ago`;
    } else {
      elapsed = `${seconds} seconds ago`;
    }

    setTimeElapsed(elapsed);
  };

  updateElapsedTime(); 
  updateElapsedTime(); 

  const interval = setInterval(updateElapsedTime, 1000);

  return () => clearInterval(interval); 
}, [postId]);


useEffect(() => {



  const fetchData = async () => {
    try {
      const collectionRef = db.collection('posts');
      const documentSnapshot = await collectionRef.doc(postId).get();
  
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        const fieldValue = data.file;
        setfilename(fieldValue);
        console.log(fieldValue);
      } else {
        console.log('Document not found!');
      }
    } catch (error) {
      console.log('Error fetching document:', error);
    }
  };
  
  fetchData();
  
},[])

const user_liked = () => {
  setliked(!liked);
  if(liked){
    const deleter = async () => {
      try {
        const parentCollectionRef = collection(db, 'posts');  
        const parentDocRef = doc(parentCollectionRef, postId); 
        const nestedCollectionRef = collection(parentDocRef, 'Likes'); 
        const q = query(nestedCollectionRef, where('liked_by', '==', user.displayName)); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      } catch (error) {
      console.log('Error deleting documents: ', error);
    }
  };
  
  deleter();
  
}else{
  const adder = () => {
    db
    .collection("posts")
    .doc(postId)
    .collection("Likes")
    .add( {
      liked_by:user?.displayName,
      timestamp:firebase.firestore.Timestamp.now()
    }
    )};
    
    adder();
  }
};


useEffect(() => {

    const unsubscribe = db
    .collection('posts')
    .doc(postId)
    .collection("Likes")
    .orderBy("timestamp","desc")
    .onSnapshot((snapshot) => {
      set_likes(snapshot.docs.map(doc => ({
        liked_by:doc.data().liked_by
      })))});
      console.log("adding element to likes");
    
    
    return () => {
      unsubscribe();
    }
  }
    
  ,[liked,user,postId]);
  
useEffect(() => {

 {
      console.log("likes length",likes.length);
      likes.forEach((like) => {
        if(like.liked_by==user?.displayName){
          setliked(true);
          console.log(true,postId,likes.liked_by);
        }else{
          false_count.push(like);
        };
      }
      );

      if(false_count.length == likes.length){
        setliked(false);
      }

  }

   
  },[user,likes,postId])


const liked_after = {
  color:liked ? "red" : "gray",
  border:liked ?"":"1px solid gray",
  borderRadius:"50%",
  marginLeft:"10px",
  marginBottom:"10px",
  width:"30px",
  height:"30px",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  fontSize:liked ?"30px":"",
};
const postcomment = (e) => { 
  e.preventDefault();
  
  db.collection("posts").doc(postId).collection("Comment").add(
    {
      text:comment,
      username:user.displayName,
        timestamp:firebase.firestore.FieldValue.serverTimestamp()
      }
      )
      setcomment('');
    }
    
    
    useEffect(() => {
      let unsubscribe;
      if (postId) {
        unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("Comment")
        .orderBy("timestamp","desc")
        .onSnapshot((snapshot) => {
          setcomments(snapshot.docs.map((doc) => 
          
          (doc.data())
          
          ))
        }); 
      }
      
      
      
      return () => {
        unsubscribe();
      }
      
    },[postId]);

    useEffect(() => {
   
     const getFileFormat= (filename) => {
      console.log(filename)
        const fileParts = filename.split('.');
        if (fileParts.length > 1) {
          
          console.log("setting file format");
          
          const format_setter = async () => {
            
            const format = await fileParts[fileParts.length - 1];
            setfile_format(format);

          }

          format_setter();

          console.log(postId);
        }
        return setfile_format("")
      }

      getFileFormat(filename);
      
    }
    ,[postId,filename]);

    
    useEffect(() => {
      console.log(file_format);
    },[file_format]);
    
    const delete_post = async () => {
      await db.collection("posts").doc(postId).collection("Likes").delete();
      await db.collection("posts").doc(postId).collection("comment").delete();
      await db.collection("posts").doc(postId).delete();
      console.log("post deleted");
    }

    const close_menu= () => setmenu(false);
    
      return (
        <div className="post">

       <div className="post_header">

      <img  src={profile_picture} alt="profile" className='post_avatar' />

      <h3> {username} </h3>
      
        {(
      
      <p className='timestamp'>
          {TimeElapsed}
      </p>
        )}

        {
          (<FontAwesomeIcon  onClick={() => setmenu(true)} className='menu' icon={faBars} />)
        }
 
       </div>
       <div className="file">

      {
        
        (file_format == "mp4" || file_format == "webm" || file_format == "ogg" )?(
          <video src={imageurl}  controls></video>
        ):(
         <img src={imageurl} alt="image" className='post_img'/>
        )
     }

       </div>
      
       <Modal
      open={menu} 
      onClose={close_menu}
      >
     {
        user?.displayName ==username && menu && user.displayName ? (
        <div className='menu_bar'>
        <p className='user_action actions' onClick={delete_post}>Delete Post</p>
        <p className='user_action actions'>Update Post</p>
        <p className='user_action actions '>Report</p>
        <p className='actions'>Add to favourites</p>
        <p className='actions'>Share Post</p>
        <p className='actions' onClick={close_menu}>cancel</p>
        </div>
        ):
        (
          <div className='menu_bar mini'>
            <p className='actions'>Report</p>
          <p className='actions'>Share Post</p>
            <p className='actions'>Add to favourites</p>
          <p className='actions' onClick={close_menu}>cancel</p>
          </div>
        )
      }

      </Modal>

     { user ? (

       <div className="like">
          <div className="post_options">
          <span 
          style={liked_after} 
          className='like_button' 
          onClick={user_liked}> 
           <FontAwesomeIcon
          icon={faHeart} /> 
          </span>
        <span>
          <FontAwesomeIcon  className='comment_button' icon={faComment} />
        </span>

        <span>
          <FontAwesomeIcon  className='share_button' icon={faShareNodes} />
        </span>
      </div>

          <div className='likes_count'>
            <span>
            {no_likes} 
            </span>
           <p className='like_text'>
           {(no_likes<=1)?("like"):("likes")}
           </p> 
          </div>

          <div className="personliked">
           {(likes.length>0)?"liked by":""} <br />
           <strong>
           { likes[0]?.liked_by}{likes[1] && ","}{ likes[1]?.liked_by}
           </strong>
          </div>

        </div>



      ) : ( <p></p> )
     }
      
 

      <h4 className='post_text'><strong>{caption && username + ":"} </strong>  {caption}</h4>

      <div className="commentbox">

        {comments.map((comment) => (
           
           <p>
              <strong>{comment.username} </strong>{comment.text}
          </p> 
        ))
        }

      </div>

    {user 
    && 
    (
    <form className='post_comment' >
      <input 
      className='post_input'
      type="text"
      placeholder='Add a comment...'
      value={comment}
      onChange={(e) => setcomment(e.target.value)}
      />

      <button
      className='post_button'
      disabled={!comment}
      type='submit'
      onClick={postcomment}
      >
        Post
      </button>
    </form>

       ) } 


    </div>
  );
}

export default Post
