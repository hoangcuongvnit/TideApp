import UserDetail from "./components/UserDetail"
import { injectReducer } from '@/store'
import reducer from './store'

injectReducer('administrator', reducer)

const ViewUser = () => <UserDetail />

export default ViewUser
