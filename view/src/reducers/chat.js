const chatInit = {
  selectUser: ''
}

const chat = (state = {...chatInit}, action) => {
  switch (action.type) {
    case 'addChat':
      return {...state, ...action.object}
    case 'delChat':
      return {...chatInit}
    default:
      return state
  }
}

export default chat

export const addChat = object => {
  return {type: 'addChat', object}
}

export const delChat = () => {
  return {type: 'delChat'}
}