import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import gameReducer from './reducer'; 
import { socketMiddleware } from '../socketMiddleware'; 

const store = createStore(
  gameReducer,
  applyMiddleware(thunk, socketMiddleware)
);

export default store;
