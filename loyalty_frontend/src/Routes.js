/* eslint-disable react/no-array-index-key */
import React, {
  lazy,
  Suspense,
  Fragment
} from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';

const routesConfig = [
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/app/management/shipments" />
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/pages/Error404View'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    path: '/login-unprotected',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/register',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    path: '/register-unprotected',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    path: '/app',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: '/app',
        component: () => <Redirect to="/app/management/shipments" />
      },
      {
        exact: true,
        path: '/app/account',
        component: lazy(() => import('src/views/pages/AccountView'))
      },
      {
        exact: true,
        path: '/app/reports/dashboard',
        component: lazy(() => import('src/views/reports/DashboardView'))
      },
      {
        exact: true,
        path: '/app/reports/dashboard-alternative',
        component: lazy(() => import('src/views/reports/DashboardAlternativeView'))
      },
      {
        exact: true,
        path: '/app/reports',
        component: () => <Redirect to="/app/reports/dashboard" />
      },
      {
        exact: true,
        path: '/app/management/customers',
        component: lazy(() => import('src/views/management/CustomerListView'))
      },
      {
        exact: true,
        path: '/app/management/customers/create',
        component: lazy(() => import('src/views/management/CustomerCreateView'))
      },
      {
        exact: true,
        path: '/app/management/customers/:customerId',
        component: lazy(() => import('src/views/management/CustomerDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/customers/:customerId/edit',
        component: lazy(() => import('src/views/management/CustomerEditView'))
      },
      {
        exact: true,
        path: '/app/management/shipments',
        component: lazy(() => import('src/views/management/ShipmentListView'))
      },
      {
        exact: true,
        path: '/app/management/shipments/create/:type',
        component: lazy(() => import('src/views/management/ShipmentCreateView'))
      },
      {
        exact: true,
        path: '/app/management/shipments/:shipmentId/:type',
        component: lazy(() => import('src/views/management/ShipmentDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/shipments/:shipmentId/edit/:type',
        component: lazy(() => import('src/views/management/ShipmentEditView'))
      },
      {
        exact: true,
        path: '/app/management/reports/shipments',
        component: lazy(() => import('src/views/management/Reports/ShipmentListView'))
      },
      {
        exact: true,
        path: '/app/management/inventories',
        component: lazy(() => import('src/views/management/InventoryListView'))
      },
      {
        exact: true,
        path: '/app/management/inventories/create',
        component: lazy(() => import('src/views/management/InventoryCreateView'))
      },
      {
        exact: true,
        path: '/app/management/inventories/:servicePackageId/edit',
        component: lazy(() => import('src/views/management/InventoryEditView'))
      },
      {
        exact: true,
        path: '/app/management/products',
        component: lazy(() => import('src/views/management/ProductListView'))
      },
      {
        exact: true,
        path: '/app/management/products/create',
        component: lazy(() => import('src/views/management/ProductCreateView'))
      },
      {
        exact: true,
        path: '/app/management/orders',
        component: lazy(() => import('src/views/management/OrderListView'))
      },
      {
        exact: true,
        path: '/app/management/orders/:orderId',
        component: lazy(() => import('src/views/management/OrderDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/invoices',
        component: lazy(() => import('src/views/management/InvoiceListView'))
      },
      {
        exact: true,
        path: '/app/management/invoices/:invoiceId',
        component: lazy(() => import('src/views/management/InvoiceDetailsView'))
      },
      {
        exact: true,
        path: '/app/management',
        component: () => <Redirect to="/app/management/customers" />
      },
      {
        exact: true,
        path: '/app/calendar',
        component: lazy(() => import('src/views/calendar/CalendarView'))
      },
      {
        exact: true,
        path: '/app/kanban',
        component: lazy(() => import('src/views/kanban/KanbanView'))
      },
      {
        exact: true,
        path: [
          '/app/chat/new',
          '/app/chat/:threadKey'
        ],
        component: lazy(() => import('src/views/chat/ChatView'))
      },
      {
        exact: true,
        path: '/app/chat',
        component: () => <Redirect to="/app/chat/new" />
      },
      {
        exact: true,
        path: [
          '/app/mail/label/:customLabel/:mailId?',
          '/app/mail/:systemLabel/:mailId?'
        ],
        component: lazy(() => import('src/views/mail/MailView'))
      },
      {
        exact: true,
        path: '/app/mail',
        component: () => <Redirect to="/app/mail/all" />
      },
      {
        exact: true,
        path: '/app/projects/overview',
        component: lazy(() => import('src/views/projects/OverviewView'))
      },
      {
        exact: true,
        path: '/app/projects/browse',
        component: lazy(() => import('src/views/projects/ProjectBrowseView'))
      },
      {
        exact: true,
        path: '/app/projects/create',
        component: lazy(() => import('src/views/projects/ProjectCreateView'))
      },
      {
        exact: true,
        path: '/app/projects/:id',
        component: lazy(() => import('src/views/projects/ProjectDetailsView'))
      },
      {
        exact: true,
        path: '/app/projects',
        component: () => <Redirect to="/app/projects/browse" />
      },
      {
        exact: true,
        path: '/app/social/feed',
        component: lazy(() => import('src/views/social/FeedView'))
      },
      {
        exact: true,
        path: '/app/social/profile',
        component: lazy(() => import('src/views/social/ProfileView'))
      },
      {
        exact: true,
        path: '/app/social',
        component: () => <Redirect to="/app/social/profile" />
      },
      {
        exact: true,
        path: '/app/extra/charts/apex',
        component: lazy(() => import('src/views/extra/charts/ApexChartsView'))
      },
      {
        exact: true,
        path: '/app/extra/forms/formik',
        component: lazy(() => import('src/views/extra/forms/FormikView'))
      },
      {
        exact: true,
        path: '/app/extra/forms/redux',
        component: lazy(() => import('src/views/extra/forms/ReduxFormView'))
      },
      {
        exact: true,
        path: '/app/extra/editors/draft-js',
        component: lazy(() => import('src/views/extra/editors/DraftEditorView'))
      },
      {
        exact: true,
        path: '/app/extra/editors/quill',
        component: lazy(() => import('src/views/extra/editors/QuillEditorView'))
      },
      {
        exact: true,
        path: '/app/admin/users',
        component: lazy(() => import('src/views/admin/users/UserListView'))
      },
      {
        exact: true,
        path: '/app/admin/users/create',
        component: lazy(() => import('src/views/admin/users/UserCreateView'))
      },
      {
        exact: true,
        path: '/app/admin/users/:userId',
        component: lazy(() => import('src/views/admin/users/UserDetailsView'))
      },
      {
        exact: true,
        path: '/app/admin/users/:userId/edit',
        component: lazy(() => import('src/views/admin/users/UserEditView'))
      },
      {
        exact: true,
        path: '/app/admin/warehouses',
        component: lazy(() => import('src/views/admin/warehouses/WarehouseListView'))
      },
      {
        exact: true,
        path: '/app/admin/warehouses/create',
        component: lazy(() => import('src/views/admin/warehouses/WarehouseCreateView'))
      },
      {
        exact: true,
        path: '/app/admin/warehouses/:warehouseId',
        component: lazy(() => import('src/views/admin/warehouses/WarehouseDetailsView'))
      },
      {
        exact: true,
        path: '/app/admin/warehouses/:warehouseId/edit',
        component: lazy(() => import('src/views/admin/warehouses/WarehouseEditView'))
      },
      {
        exact: true,
        path: '/app/admin/service-packages',
        component: lazy(() => import('src/views/admin/servicePackages/ServicePackageListView'))
      },
      {
        exact: true,
        path: '/app/admin/service-packages/create',
        component: lazy(() => import('src/views/admin/servicePackages/ServicePackageCreateView'))
      },
      {
        exact: true,
        path: '/app/admin/service-packages/:servicePackageId/edit',
        component: lazy(() => import('src/views/admin/servicePackages/ServicePackageEditView'))
      },
      {
        exact: true,
        path: '/app/admin/vendors',
        component: lazy(() => import('src/views/admin/vendors/VendorListView'))
      },
      {
        exact: true,
        path: '/app/admin/vendors/create',
        component: lazy(() => import('src/views/admin/vendors/VendorCreateView'))
      },
      {
        exact: true,
        path: '/app/admin/vendors/:vendorId/edit',
        component: lazy(() => import('src/views/admin/vendors/VendorEditView'))
      },
      {
        exact: true,
        path: '/app/admin/drivers',
        component: lazy(() => import('src/views/admin/drivers/DriverListView'))
      },
      {
        exact: true,
        path: '/app/admin/drivers/create',
        component: lazy(() => import('src/views/admin/drivers/DriverCreateView'))
      },
      {
        exact: true,
        path: '/app/admin/drivers/:driverId/edit',
        component: lazy(() => import('src/views/admin/drivers/DriverEditView'))
      },
      {
        exact: true,
        path: '/app/admin/customer-representatives',
        component: lazy(() => import('src/views/admin/customerRepresentatives/CustomerRepresentativeListView'))
      },
      {
        exact: true,
        path: '/app/admin/customer-representatives/create',
        component: lazy(() => import('src/views/admin/customerRepresentatives/CustomerRepresentativeCreateView'))
      },
      {
        exact: true,
        path: '/app/admin/customer-representatives/:customerRepresentativeId/edit',
        component: lazy(() => import('src/views/admin/customerRepresentatives/CustomerRepresentativeEditView'))
      },
      {
        component: () => <Redirect to="/404" />
      },
    ]
  },
  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/pricing',
        component: lazy(() => import('src/views/pages/PricingView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

const renderRoutes = (routes) => (routes ? (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
) : null);

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
