import axios from "axios";
import React, {useContext} from "react";
import { useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import  AuthContext from "./AuthContext";
import "./Homepage.css";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

export default function Homepage() {
  const [postState, setPostState] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const { isAuth, user } = authContext;
  const [editingPostId, setEditingPostId] = useState();
  const [editingContent, setEditingContent] = useState("");
  const [tweetContent, setTweetContent] = useState("");

  useEffect(() => {
      getLatestPosts(); // Fetch posts if authenticated
  }, []);


  async function getLatestPosts() {
    try {
      const response = await axios.get("/api/public/post", {
        withCredentials: true, // Include cookies in the request
      });
      setPostState(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {

  }, [postState]);

  const handlePost = async () => {
   // return a json
    try {
      const response = await axios.post(
          "/api/post",
          { content: tweetContent }
      );

      console.log("post response", response);
      // Add the new post to the existing state
      setPostState((prevState) => [response.data, ...prevState ]);
      setTweetContent(""); // Clear input field
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  }

  function revealHiddenInput(postId) {
    setEditingPostId(postId);
    setEditingContent("");
  }

  async function savePost(postId, content) {
    setEditingPostId(null);
    setEditingContent("");

    try {
      const response = await axios.put("/api/post/" + postId, {
        content
      })
      if (response.status === 200) {
        const updatedPostState = postState.map((post) => {
          if (post._id === postId) {
            return {...post, content: response.data.content};
          }
          return post;
        });

        console.log(response);

        setPostState(updatedPostState);
      }
    } catch (error) {
      toast.error("Error updating post")
    }
  }

  function confirmDelete(postId) {
    if (window.confirm("Are you sure you want to delete?")) {
      // delete this post
      const response = axios.delete("/api/post/" + postId);
      const newPostState = postState.filter(
          (post) => post._id !== postId
      );
      setPostState(newPostState);
    }
  }

  return (
      <div className="homepage">
        <Navbar />
        <div className="container">
          <h1>Tweet here</h1>
          {/* Input Area for Posting */}
          <div className="post-input-container">
        <textarea
            id="postInput"
            placeholder="What's happening?"
            maxLength="280"
            onChange={(event) => setTweetContent(event.target.value)}
            value={isAuth ? tweetContent : ''}
        ></textarea>
            <div className="post-actions">
              <button
                  type="button"
                  id="postButton"
                  onClick={handlePost}
                  disabled={!tweetContent.trim()}
              >
                Tweet
              </button>
            </div>
          </div>

          {/* Display All Posts */}
          <div className="posts">
            {postState.length > 0 ? (
              postState.map((post, index) => (
                  <div className="post" key={index}>
                    <div className="post-header">
                      <Link to={`/user/${post.user._id}`}>
                        <h3 className="username">{`@${post.user.username}`
                            || "Unknown User"}</h3>
                      </Link>
                      <span className="timestamp">
                    posted on {new Date(post.createdAt).toLocaleString()}
                     </span>
                    </div>
                    <p className="post-content">{post.content}</p>
                    { (isAuth && post.user._id === user._id) && (
                      <div className="post-edit">
                        <button className="delete-post-button"
                                onClick={() => confirmDelete(post._id)}>Delete
                        </button>
                        <button className="edit-post-button" onClick={() => revealHiddenInput(post._id)}>
                          Edit
                        </button>
                      </div>
                    )}

                    <div className="post-edit-textarea">
                      { editingPostId === post._id && (
                          <>
                            <textarea
                                name="text"
                                value={editingContent}
                                onChange={(event) => setEditingContent(event.target.value)}
                            />
                            <button onClick={() => savePost(post._id, editingContent)}>
                              Save
                            </button>
                          </>
                      )}
                    </div>
                  </div>
              ))
            ) : (
                <p>No posts yet. Be the first to tweet!</p>
            )}
          </div>
        </div>
      </div>
  );
}


