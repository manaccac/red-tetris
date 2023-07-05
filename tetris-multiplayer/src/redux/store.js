import { createStore } from 'redux';
import gameReducer from './reducer'; 

const store = createStore(gameReducer);

export default store;
