import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import {storage, db } from "./database";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import "./imageUpload.css";
import { getDocs ,deleteDoc ,query, where , collection ,doc} from "firebase/firestore";



function Imageupload({user,username}) {
  
  const [caption, setcaption] = useState('');
  const [image, setimage] = useState("");
  const [file_format, setfile_format] = useState('');
  const [progress, setprogress] = useState(0);
const [current_profile_pic,setcurrent_profile_pic] = useState("https://www.iconpacks.net/icons/2/free-icon-user-3296.png");

  const handlechange = (e) => {
    if (e.target.files[0]){
      console.log("image choosed");
      const file = e.target.files[0];
      setimage(file);
      console.log("image setted");
    }
  };

  useEffect(() => {

    const profile_setter =async () => {
      
      
      try {
        const parentCollectionRef = collection(db, 'user_details');  
        const q = query(parentCollectionRef, where('username', '==', user.displayName)); 
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

  },[user])

  const handlePost = () => {
    db.collection("posts").add(
      {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        caption:caption,
        username:username,
        profile_pic:current_profile_pic,
        
      });
  }

  const handleUpload = () => {
      const uploadtask = storage.ref(`images/${image.name}`).put(image);
      console.log("uploading");
      uploadtask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100);
        setprogress(progress);
        console.log("calculating percentage");
      },
      (error) => {
          console.log(error);
          alert(error.message);
          
        },
        () => {
          console.log(image.name);
          console.log("accessing storage");
          storage.ref("images").child(image.name).getDownloadURL()
          .then( (url) => {
            db.collection("posts").add(
              {
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption:caption,
                file:image.name,
                imageurl:url,
                username:username,
                profile_pic:current_profile_pic,
                file_format:file_format
                
              });
              console.log("added to collection");
              setprogress(0);
              setcaption("");
              setimage(null);
          })
  
        }

        );
      }
      useEffect(() => {
   
        const getFileFormat= (filename) => {
         console.log(filename)
           const fileParts = filename?.split('.');
           if (fileParts?.length > 1) {
             
             console.log("setting file format");
             
             const format_setter = async () => {
               
               const format = await fileParts[fileParts.length - 1];
               setfile_format(format);
   
             }
   
             format_setter();
   
           }
           return setfile_format("")
         }
   
         getFileFormat(image?.name);
         
       }
       ,[image]);

  return (
    <div className='imageupload'>

      <progress className='progress' value={progress} max="100"/>

      <input className='caption_input' type="text" placeholder='Enter a caption...' value={caption} onChange={e => setcaption(e.target.value)}/>

      <button onClick={handlePost}>post</button>

      <input  className='choosefile_button' type="file" onChange={handlechange}/>

      <button onClick={handleUpload}>Upload</button> 
    </div>
  )
}

export default Imageupload;
