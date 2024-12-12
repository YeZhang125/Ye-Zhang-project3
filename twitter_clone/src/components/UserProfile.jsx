import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import "./UserProfile.css";
import Navbar from "./Navbar";
import AuthContext from "./AuthContext";

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditingBioVisible, setIsEditingBioVisible] = useState(false);
  const [editingBioContent, setEditingBioContent] = useState("");

  const authContext = useContext(AuthContext);

  const { isAuth, user } = authContext;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`api/public/user/${userId}`);
        if (response.status !== 200) {
          toast.error("Failed to fetch user data");
          return;
        }
        setUserProfile(response.data);
        setBio(response.data.bio);
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error(error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`api/public/user/${userId}/posts`);
        if (response.status !== 200) {
          toast.error("Failed to fetch user posts");
          return;
        }
        setUserPosts(response.data);
      } catch (error) {
        toast.error("Failed to fetch user posts");
        console.error(error);
      }
    }

    if (userId) { // Ensure userId is valid before fetching
      fetchUserData();
      fetchUserPosts();
    }
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US',
        {year: 'numeric', month: 'long', day: 'numeric'})
  }

  async function modifyBio(newBio) {
    try {
      // Send updated bio to the server
      const response = await axios.put(`api/user/${userId}/bio`, {bio: newBio});

      if (response.status !== 200) {
        toast.error("Failed to update bio");
        return;
      }
      toast.success("Bio updated successfully");
      // Update the local state with the updated bio from the server
      setBio(response.data.bio);
      setEditingBioContent("");
      setIsEditingBioVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update bio");
    }
  }

  function revealHiddenInput(userId) {
    setIsEditingBioVisible(true);
    setEditingBioContent("");
  }

      return (
      <>
        <Navbar />
        { userProfile && (

        <div className="user-profile">
          <div className="user-profile-header">
            <div className="user-profile-name">
              <h1>{userProfile.username}</h1>
              <span>Joined on {formatDate(userProfile.createdAt)}</span>

            </div>

            <div className="user-profile-bio">
              <span>
                {bio || "No bio provided"}
              </span>
              {(isAuth && userProfile._id === user._id) && (
                  <>
                    <button onClick={() => revealHiddenInput()}>Update Bio
                    </button>
                    {isEditingBioVisible && (
                        <>
                          <textarea name="bio"
                            value={editingBioContent}
                            onChange={(event) => setEditingBioContent(
                                event.target.value)}/>
                          <button onClick={() => modifyBio(editingBioContent)}>
                            Save
                          </button>
                        </>
                    )}
                  </>
              )}
            </div>
          </div>
          <div className="user-profile-body">

            <div className="user-profile-posts">
              {userPosts && userPosts.map(post => (
                  <div className="user-profile-post" key={post._id}>
                    <div className="user-profile-post-content" >
                      {post.content}
                    </div>
                    <div className="user-profile-post-created-at">
                      posted on {formatDate(post.createdAt)}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )
      }
      </>
  )
      ;
    }
;

export default UserProfile;