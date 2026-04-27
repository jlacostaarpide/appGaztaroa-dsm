import * as ActionTypes from './ActionTypes';

export const comentarios = (state = { errMess: null, comentarios:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMENTARIOS:
      return {...state, errMess: null, comentarios: action.payload};

    case ActionTypes.ADD_COMENTARIO:
      const nuevoId = state.comentarios.length > 0
        ? Math.max(...state.comentarios.map(c => c.id)) + 1
        : 1;
      return {...state, comentarios: state.comentarios.concat({...action.payload, id: nuevoId})};

    case ActionTypes.COMENTARIOS_FAILED:
      return {...state, errMess: action.payload};

    default:
      return state;
  }
};