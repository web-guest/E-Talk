
  export const isSameSender = (messages, m, i, userId) => {
    return (
      i <= messages.length - 1 &&
      messages[i - 1] &&
      m &&
      messages[i - 1].sender &&
      m.sender &&
      (messages[i -1].sender._id !== m.sender._id ||
        messages[i -1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  export const isFirstMessage = (messages, i, userId) => {
    return (
      i === 0 &&
      messages[i].sender._id !== userId 
    );
  };

export const getTime=(timeString)=>{
  const updatedDate= new Date(timeString);

  let hours = updatedDate.getHours();
const minutes = updatedDate.getMinutes();
 const ampm=hours>=12 ? 'PM' : 'AM';
 hours =hours%12 || 12
const formatedTime= `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`
return formatedTime
} 