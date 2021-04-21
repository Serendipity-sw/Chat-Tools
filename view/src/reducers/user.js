let userInit = {
  userName: '',
  imageUrl: ''
}

const user = (state = userInit, action) => {
  switch (action.type) {
    case 'addUser':
      return {...state, ...action.object}
    case 'delUser':
      return {...userInit}
    default:
      return state
  }
}

export default user


export const addUser = object => ({type: 'addUser', object})

export const delUser = () => ({type: 'delUser'})