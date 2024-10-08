import HandThumbsUpIcon from "../assets/HandThumbsUpIcon.jsx";
import HandThumbsDownIcon from "../assets/HandThumbsDownIcon.jsx";
import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../js/firestoreConfig.js";

const CommentRatingButtons = ({ comment, postId, comId }) => {
  const commentRef = doc(db, "allComments", `${comId}`);
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);

  const handleLikeClick = async () => {
    const comment = await getDoc(commentRef);
    const lastVote = localStorage.getItem(`${comId}-lastVote`);

    if (!lastVote) {
      localStorage.setItem(`${comId}-lastVote`, "liked");
      const newRating = {
        likes: ++comment.data().likes,
      };
      setLikes(newRating.likes);
      await updateDoc(commentRef, newRating);
    } else if (lastVote === "liked") {
      return;
    } else if (lastVote === "disliked") {
      localStorage.removeItem(`${comId}-lastVote`);
      localStorage.setItem(`${comId}-lastVote`, "liked");
      const newRating = {
        likes: ++comment.data().likes,
        dislikes: --comment.data().dislikes,
      };
      setLikes(newRating.likes);
      setDislikes(newRating.dislikes);
      await updateDoc(commentRef, newRating);
    }
  };

  const handleDislikeClick = async () => {
    const comment = await getDoc(commentRef);
    const lastVote = localStorage.getItem(`${comId}-lastVote`);

    if (!lastVote) {
      localStorage.setItem(`${comId}-lastVote`, "disliked");
      const newRating = {
        dislikes: ++comment.data().dislikes,
      };
      setDislikes(newRating.dislikes);
      await updateDoc(commentRef, newRating);
    } else if (lastVote === "disliked") {
      return;
    } else if (lastVote === "liked") {
      localStorage.removeItem(`${comId}-lastVote`);
      localStorage.setItem(`${comId}-lastVote`, "disliked");
      const newRating = {
        likes: --comment.data().likes,
        dislikes: ++comment.data().dislikes,
      };
      setLikes(newRating.likes);
      setDislikes(newRating.dislikes);
      await updateDoc(commentRef, newRating);
    }
  };

  return (
    <div className="comment__likebuttons">
      <button
        onClick={handleLikeClick}
        className="comment__like"
        type="button"
        aria-label="Полезно"
      >
        <HandThumbsUpIcon likes={likes} />
      </button>
      <button
        onClick={handleDislikeClick}
        className="comment__like"
        type="button"
        aria-label="Бесполезно"
      >
        <HandThumbsDownIcon dislikes={dislikes} />
      </button>
    </div>
  );
};

export default CommentRatingButtons;
