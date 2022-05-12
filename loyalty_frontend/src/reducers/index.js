import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './accountReducer';
import notificationsReducer from './notificationsReducer';
import chatReducer from './chatReducer';
import mailReducer from './mailReducer';
import kanbanReducer from './kanbanReducer';
import customerReducer from './customerReducer';
import shipmentReducer from './shipmentReducer';
import userReducer from './userReducer';
import servicePackageReducer from './servicePackageReducer';
import inventoryReducer from './inventoryReducer';
import inventoryTransactionReducer from './inventoryTransactionReducer';
import warehouseReducer from './warehouseReducer';
import vendorReducer from './vendorReducer';
import driverReducer from './driverReducer';
import customerRepresentativeReducer from './customerRepresentativeReducer';
import garbageReducer from './garbageReducer';

const rootReducer = combineReducers({
  account: accountReducer,
  notifications: notificationsReducer,
  chat: chatReducer,
  mail: mailReducer,
  kanban: kanbanReducer,
  shipment: shipmentReducer,
  customer: customerReducer,
  user: userReducer,
  servicePackage: servicePackageReducer,
  inventory: inventoryReducer,
  inventoryTransaction: inventoryTransactionReducer,
  warehouse: warehouseReducer,
  vendor: vendorReducer,
  driver: driverReducer,
  customerRepresentative: customerRepresentativeReducer,
  garbage: garbageReducer,
  form: formReducer
});

export default rootReducer;
