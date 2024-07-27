import React, { useEffect, useState } from 'react';
import './Profile.css';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";
import { faCircleUser, faUser, faHouse, faMagnifyingGlass ,faBell, faUpload, faMessageDots,faGear, faRightToBracket ,faBars,faArrowRight,faImage,faVideo,faStar,faHeart} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {db, storage } from "./database";
import Modal from '@mui/material/Modal';
import { getDocs ,deleteDoc ,query, where , collection ,doc,updateDoc} from "firebase/firestore";
import datacontext from './datacontext';

function Profile({posts,user}) {
  
  const [edit_profile,setedit_profile] = useState(false);
  const [user_details_exists,setuser_details_exists] = useState(false);
  const [profile_pic,setprofile_pic] = useState(null);
  const [User, setUser] = useState(user);
  const [current_profile_pic,setcurrent_profile_pic] = useState("https://www.iconpacks.net/icons/2/free-icon-user-3296.png");
  const [Bio,setBio] = useState("");
  const [progress, setprogress] = useState(0);
  const [bio,setbio] = useState(Bio);
  const [uploads,setuploads] = useState([]);
  const [image_uploads,setimage_uploads] = useState([]);
  const [video_uploads,setvideo_uploads] = useState([]);
  const [image_uploads_open,setimage_uploads_open] = useState(true);
  const [video_uploads_open,setvideo_uploads_open] = useState(false);
  const [post_list,setpost_list] = useState(posts);
  const [uploading_profile, setuploading_profile] = useState(false);
  const [profile_updated, setprofile_updated] = useState(false);
  const [bio_updated, setbio_updated] = useState(false);
  useEffect(() => {
    console.log(post_list)
    setpost_list(posts)
    setuploads(post_list.map((post) => (
       post.post.username===User?.displayName && post.post.imageurl
      )))
      
    },[])
    console.log(posts);
    
    post_list.forEach((post) => {
      
      console.log(post.post.username)
    })

    useEffect(() => {
      if(!user?.displayName.exists){
        setcurrent_profile_pic("https://www.iconpacks.net/icons/2/free-icon-user-3296.png");
        setimage_uploads_open(true)
      }
    },[user])
 
  // useEffect(() => {
  //   const userexistence = async () => {
  //       const parentCollectionRef = collection(db, 'user_details');
  //       const q = query(parentCollectionRef, where('username', '==', user?.displayName));
  //       const querySnapshot = await getDocs(q);
  //       querySnapshot.exists && setuser_details_exists(true);
  //       alert(user_details_exists)
  //  }
  //  userexistence();
  // },[])

  useEffect(() => {
    setvideo_uploads(
      post_list.map((post) => {
        if (post.post.username === User?.displayName && (post.post.file_format === "mp4" || post.post.file_format === "ogg" || post.post.file_format === "webm")) {
          return post.post.imageurl;
        } else {
          return null; 
        }
      })
    );
      console.log(video_uploads,"videos");
    },[])
    
    useEffect(() => {
      setimage_uploads(
        post_list.map((post) => {
          if (
            post.post.username === User?.displayName &&
            (post.post.file_format === "gif" ||
              post.post.file_format === "jpg" ||
              post.post.file_format === "png" ||
              post.post.file_format === "jpeg")
          ) {
            return post.post.imageurl;
          } else {
            return null; 
    }})
      );
        console.log(image_uploads,"images");

  },[user])

  const profile_uploads = () =>  {
    
    // if(!user_details_exists ){
      const uploadtask_dp = storage.ref(`user_details/${user?.displayName}/Profile_pic`).put(profile_pic);
      alert("uploading");
      uploadtask_dp.on(
        "state_changed",
        (snapshot) => {
          setuploading_profile(true);
          alert("calculating percentage");
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100);
          setprogress(progress);
        },
      (error) => {
        console.log(error);
        alert(error.message);
        
      },
      () => {
        alert("accessing storage");
        storage.ref(`user_details/${user?.displayName}/Profile_pic`).getDownloadURL()
        .then( (url) => {
          db.collection("user_details").add(
            {
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              username:user?.displayName,
              file:profile_pic.name,
              imageurl:url,
              bio:bio
              
            });
            alert("added to collection");
            setuploading_profile(false);
            setedit_profile(null);
            setprogress(0);
            setprofile_updated(true);
          })
          
        }
        
      );
    // }else if(profile_pic== null&& bio !=Bio){
    //   const update_bio = async () => {
    //     try {
    //       const parentCollectionRef = collection(db, 'user_details');
    //       const q = query(parentCollectionRef, where('username', '==', user?.displayName));
    //       const querySnapshot = await getDocs(q);
          
    //       querySnapshot.forEach((doc) => {
    //         const documentRef = doc.ref;
    //         updateDoc(documentRef, { bio: bio })
    //         .then(() => {
    //           console.log('bio updated successfully!');
    //           setbio_updated(!bio_updated);
    //         })
            
    //       });
    //     } catch (error) {
    //       console.error('Error querying documents:', error);
    //     }
    //   };
      
    //   update_bio();
    // }else if(profile_pic!= null&& bio ==Bio){
      
    //   const update_pic = async () => {
    //     try {
    //       const uploadtask_dp =await storage.ref(`user_details/${user?.displayName}/Profile_pic`).put(profile_pic);
    //       storage.ref(`user_details/${user?.displayName}/Profile_pic`).getDownloadURL()
    //       .then( async(url) => {
            
    //         const parentCollectionRef = collection(db, 'user_details');
    //         const q = query(parentCollectionRef, where('username', '==', user?.displayName));
    //         const querySnapshot = await getDocs(q);
            
    //         querySnapshot.forEach((doc) => {
    //           const documentRef = doc.ref;
    //           updateDoc(documentRef, { imageurl:url })
    //           .then(() => {
    //             console.log('profile updated successfully!');
    //           })
    //           .catch((error) => {
    //             console.error('Error updating field:', error);
    //           });
              
    //         });
    //           alert("added to collection");
    //           setprofile_pic(null);
    //           setprofile_updated(true);
    //         }
    //         );
    //       } catch (error) {
    //       console.error('Error querying documents:', error);
    //     }
    //   };
      
    //   update_pic();
      
    // }
  }
  
  useEffect(() => {
    
    
    const bio_save = async () => {
      try {
        const parentCollectionRef = collection(db, 'user_details');  
        const q = query(parentCollectionRef, where('username', '==', user?.displayName)); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const user_data = doc.data();
          const user_bio = user_data.bio;
          setBio(user_bio);
          setbio(Bio);
        });
      } catch (error) {
        console.log('Error setting bio: ', error)
      }
    };
    
    bio_save();
  },[bio_updated,profile_updated,edit_profile,user])
  
  
  
  useEffect(() => {
    
    const profile_setter =async () => {
      
      
      try {
        const parentCollectionRef = collection(db, 'user_details');  
        const q = query(parentCollectionRef, where('username', '==', user?.displayName)); 
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const profile_pic_doc = doc.data();
          const profile_pic_url = profile_pic_doc.imageurl;
          if(profile_pic_url){
            setcurrent_profile_pic(profile_pic_url);
          }
        });
      } catch (error) {
      console.log('Error deleting documents: ', error);
    }
    console.log(current_profile_pic);
    }

    profile_setter();

  },[profile_updated,user])
  
  useEffect(() => {
    
    const posts_profile_setter =async () => {
      
      
      try {
        const parentCollectionRef = collection(db, 'posts');  
        const q = query(parentCollectionRef, where('username', '==', user?.displayName)); 
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const querySnapshotref = doc.ref;
          updateDoc(querySnapshotref,{profile_pic:current_profile_pic})
        });
      } catch (error) {
      console.log('Error updating documents: ', error);
    }
    }

    posts_profile_setter();

  },[current_profile_pic])
  

  const profile_pic_upload = (e) => {
    const profile_picture = e.target.files[0];
    setprofile_pic(profile_picture);
    console.log(profile_pic);
  }

 

  return (
    <datacontext.Provider value={current_profile_pic}>

    <div className='profile'>

       
      <Modal
      open={edit_profile} 
      onClose={() => setedit_profile(false)}
      >
      {
        ( 
          <div className="profile_update_popup">

          <img className='profile_pic' src={current_profile_pic} alt="profile" />

          <input type="file"  onChange={profile_pic_upload} />

         {uploading_profile && <p>`{ progress}%`</p>}

          <label htmlFor="bio_box">Bio</label>

          <textarea className='bio_box' value={bio} onChange={(e)=>setbio(e.target.value)} name='bio_box' rows={20} type="text" />

          <button className='save' onClick={profile_uploads }>Save</button>
          </div>
        )
        
      }

      </Modal>

      <div className="header">

      <img className='profile_pic' src={current_profile_pic}  alt="profile" />

      <div>
      
      {user?.displayName &&
        <>
         <h1>{user.displayName}</h1>
         <button className='edit_profile' onClick={() => setedit_profile(true)}>Edit Profile</button>
        </>
      }
      </div>

      </div>

      <div className="bio">
        <p>{Bio}</p>
      </div>

      <div className="posts">

      <FontAwesomeIcon className='image list' 
      onClick={() =>
        {setimage_uploads_open(true)
        setvideo_uploads_open(false)}
      }
       icon={faImage} />

      <FontAwesomeIcon 
      onClick={() =>
        {setvideo_uploads_open(true)
        setimage_uploads_open(false)}
      } 
      className='video list' 
      icon={faVideo} />

      <FontAwesomeIcon
       className='favourite list' 
       icon={faStar} />

      <FontAwesomeIcon 
      className='liked list' 
      icon={faHeart} />

      </div>

      <div className="uploads">

        { user?.displayName && image_uploads_open && 
          image_uploads.map((image_upload)=> (
            image_upload &&
            <div>

            <img src={image_upload} className='image_uploads' alt="image" />
            
            </div>
            ))
          }
        { user?.displayName && video_uploads_open && 
          video_uploads.map((video_upload)=> (
            video_upload &&
            <div>

            <video src={video_upload} className='video_uploads' alt="video" controls></video>
            
            </div>
            ))
          }


      </div>

    </div>
    </datacontext.Provider>
  )
}

export default Profile;
