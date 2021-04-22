const socketMessage = (state = {userList: [], messageList: []}, action) => {
  let {userList, messageList} = state
  switch (action.type) {
    case 'addSocketMessageUserList':
      userList = action.object || []
      return {userList, messageList}
    case 'addSocketMessageMessage':
      messageList.push(action.object)
      return {userList, messageList}
    case 'delSocketMessage':
      return {userList: [], messageList: []}
    default:
      return state
  }
}

export default socketMessage

export const addUserList = object => {
  return {type: 'addSocketMessageUserList', object}
}

export const addMessage = object => {
  return {type: 'addSocketMessageMessage', object}
}

export const delSocketMessage = () => {
  return {type: 'delSocketMessage'}
}