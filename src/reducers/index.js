import { combineReducers } from 'redux'
import LuvatReducer from './LuvatReducer'
import LoginReducer from './LoginReducer'
import { reducer as reduxFormReducer } from 'redux-form';


const rootReducer = combineReducers({
  luvat: LuvatReducer,
  user: LoginReducer,
  form: reduxFormReducer
})

export default rootReducer
