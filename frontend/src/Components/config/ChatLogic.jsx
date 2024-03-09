export const getSender = (loggedUser, users) => {

 const name = users[0]._id === loggedUser?._id ? users[1].name : users[0].name

 return name;
     
 }
 export const getImg = (loggedUser, Chat) => {

        return  Chat[0]._id === loggedUser.data._id ? Chat[1].img : Chat[0].name;
    
}
 export const getSenderfull = (loggedUser, users) => {
     return users.users[0]._id === loggedUser.data._id ? users.users[1] : users.users[0];
 }

 export const IsSameSender = (messages,m,i,userId)=>{
    return (
        i<messages.length-1 && 
        (messages[i+1].sender._id!== m.sender._id || messages[i+1].sender._id === undefined)&&messages[i].sender._id!==userId
    );
 };
 

 export const isLastMessage = (messages,i,userId)=>{
    return(
        i===messages.length-1&&messages[messages.length-1].sender._id!==userId&&messages[messages.length-1].sender._id
    );
 };

 export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };