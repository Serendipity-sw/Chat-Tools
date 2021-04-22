const socketInit = {
  socketInit: null,
  socket: null
}

const socket = (state = {...socketInit}, action) => {
  switch (action.type) {
    case 'addSocket':
      return {...state, ...action.object}
    case 'delSocket':
      return {...socketInit}
    default:
      return state
  }
}

export default socket

export const addSocket = object => {
  return {type: 'addSocket', object}
}

export const delSocket = () => {
  return {type: 'delSocket'}
}