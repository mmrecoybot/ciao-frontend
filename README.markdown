# Application API Documentation

## 1. Introduction

This document provides a comprehensive guide to the Application API, which manages users, dealers, products, orders, activations, and related entities. It supports both administrative and dealer-specific interactions, incorporating robust security through authentication, Role-Based Access Control (RBAC), soft deletion for data lifecycle management, and dealer-specific data scoping.

## 2. Core Concepts

### 2.1. Authentication (Token-Based)

The API uses JSON Web Tokens (JWT) for authentication.

- **Mechanism**: Users log in with email and password to receive an `access_token` (short-lived, e.g., 15 minutes) and a `refresh_token` (longer-lived, e.g., 7 days).
- **Access Token**: Sent in the `Authorization` header as `Bearer <access_token>` for protected endpoints.
- **Refresh Token**: Used to obtain a new `access_token` via `/auth/refresh-token`.
- **Endpoints**:
  - `POST /auth/login`: Obtain tokens.
  - `POST /auth/refresh-token`: Refresh access token.
  - `POST /auth/logout`: Invalidate refresh token.
- **Middleware (`authenticateToken`)**: Verifies the access token and ensures the associated user is not soft-deleted (`User.deletedAt IS NULL`). Returns 401 if invalid or user is deleted.

### 2.2. Authorization (Role-Based Access Control - RBAC)

Access to endpoints is controlled by roles and permissions.

- **User**: Assigned one role.
- **Role**: A collection of permissions, can be created/updated/soft-deleted.
- **Permission**: Specific system capability (e.g., `view_users`), can be created/updated/soft-deleted.
- **Assignment**: Permissions are linked to roles (many-to-many).
- **Middleware (`checkPermission`)**: Verifies:
  - User has a non-deleted role (`Role.deletedAt IS NULL`).
  - Required permission is assigned to the role and not soft-deleted (`Permission.deletedAt IS NULL`).
- **Flow**: Request → `authenticateToken` → `checkPermission` → Controller. Failure returns 401/403.

### 2.3. Soft Deletion

Entities (User, Role, Permission, Dealer, Product, Order, etc.) use soft deletion instead of permanent removal.

- **Mechanism**: A `deletedAt` field (DateTime?) is set to the current timestamp on deletion (`new Date()`). `NULL` indicates an active entity.
- **GET Endpoints**: Filter results to `deletedAt IS NULL`. Related entities (via Prisma’s `include`) are similarly filtered.
- **DELETE Endpoints**: Implemented as `UPDATE` operations setting `deletedAt`. Query with `where: { id: <id>, deletedAt: null }` to avoid re-deleting (returns 404 if already deleted).
- **UPDATE Endpoints**: Query by ID without `deletedAt` filter, allowing updates to soft-deleted records, including undeleting (`deletedAt: null`).
- **Undelete**: Use `PUT /resource/:id/undelete` or `PUT /resource/:id` with `{"deletedAt": null}`. Targets deleted records with `where: { deletedAt: { not: null } }`.
- **Cascading Soft Delete**: Some deletions (e.g., Order, Product) may soft-delete related entities (OrderItems, ProductVariations) within the same transaction.

### 2.4. Dealer-Specific Scoping

Users with a `dealerId` are restricted to data associated with their dealer.

- **Mechanism**: Controllers add `where: { dealerId: req.user.dealerId }` filters for dealer-related resources (Orders, SalePoints, etc.).
- **Applicability**: Affects dealer-specific resources, not global ones (Permissions, Roles, Categories).
- **Permissions vs. Scoping**: `checkPermission` verifies capability; controllers enforce `dealerId` filtering.
- **Global Users**: Users without `dealerId` (e.g., SuperAdmins) access data globally with appropriate permissions.

## 3. Permissions List

### 3.1. Scoped Permissions (Dealer-Filtered)

For users with `dealerId`, these apply only to their dealer’s data:
- `view_dealers`, `update_dealers`, `delete_dealers`
- `view_dealer_billing`, `manage_dealer_billing`
- `view_dealer_contracts`, `manage_dealer_contracts`
- `view_dealer_credit`, `manage_dealer_credit`
- `view_dealer_documents`, `manage_dealer_documents`
- `view_dealer_salepoints`, `manage_dealer_salepoints`
- `view_orders`, `create_orders`, `update_orders`, `delete_orders`
- `view_user_analytics`, `view_sales_analytics`, `view_product_analytics`, `view_dealer_analytics`, `view_activation_analytics`, `view_revenue_forecast`
- `view_workflows`, `manage_workflows`
- `view_assets`, `upload_assets`

### 3.2. Global Permissions

Apply system-wide, typically for users without `dealerId`:
- `assign_permissions`
- `delete_permissions`, `delete_roles`
- `generate_pdfs`
- `manage_admins`, `manage_assets`, `manage_notifications`, `manage_permissions`, `manage_roles`, `manage_users`
- `send_emails`
- `"Manage Shop"` (product catalog, categories, brands)
- `update_permissions`, `update_roles`, `update_workflows`
- `view_all_notifications`, `view_admins`, `view_permissions`, `view_roles`, `view_users`, `view_workflows`

## 4. Suggested Roles

### 4.1. Global Roles
- **Super Administrator (SuperAdmin)**: All permissions.
- **Administrator (Admin)**: Broad global permissions (e.g., `manage_users`, `manage_roles`, `view_all_notifications`).
- **Sales Manager (SalesManager)**: Sales and dealer management (e.g., `"Manage Shop"`, `view_dealers`, `view_sales_analytics`).
- **Shop Manager (ShopManager)**: Product catalog focus (e.g., `"Manage Shop"`, `upload_assets`).

### 4.2. Dealer-Specific Roles
- **Dealer Viewer (DealerViewer)**: View-only scoped permissions.
- **Dealer Sales (DealerSales)**: Dealer Viewer permissions plus `manage_dealer_documents`, `create_orders`, `upload_assets`.
- **Dealer Activator (DealerActivator)**: Scoped activation permissions (e.g., `update_orders`, `manage_workflows`).
- **Dealer Accounts (DealerAccounts)**: Scoped billing/finance permissions.
- **Dealer Manager (DealerManager)**: All scoped permissions plus `update_dealers`, `delete_dealers`.

## 5. API Endpoints Reference

All endpoints except `/auth` require `authenticateToken`. Endpoints with permissions require `checkPermission`.

### Authentication & User Auth Flow (/auth)
- `POST /auth/register`: Register user (Public).
- `POST /auth/login`: Login (Public).
- `POST /auth/refresh-token`: Refresh token (Public).
- `POST /auth/logout`: Invalidate refresh token (Public).
- `POST /auth/password/forgot`: Request password reset (Public).
- `POST /auth/password/reset`: Reset password (Public).
- `PUT /auth/password/change`: Change password (Authenticated, ownership check).

### Admin User Management (/users)
- `GET /users`: List users (`view_users`).
- `GET /users/:id`: Get user (`view_users`).
- `PUT /users/:id`: Update user (`manage_users`).
- `DELETE /users/:id`: Soft-delete user (`manage_users`).
- `PUT /users/:id/undelete`: Undelete user (`manage_users`).

### HR Management (/hr)
#### Roles (/hr/roles)
- `POST /hr/roles`: Create role (`manage_roles`).
- `GET /hr/roles`: List roles (`view_roles`).
- `GET /hr/roles/:id`: Get role (`view_roles`).
- `PUT /hr/roles/:id`: Update role (`manage_roles`).
- `DELETE /hr/roles/:id`: Soft-delete role (`manage_roles`).
- `POST /hr/roles/:roleId/permissions`: Assign permissions (`assign_permissions`).
- `DELETE /hr/roles/:roleId/permissions/:permissionId`: Remove permission (`assign_permissions`).

#### Permissions (/hr/permissions)
- `POST /hr/permissions`: Create permission (`manage_permissions`).
- `GET /hr/permissions`: List permissions (`view_permissions`).
- `GET /hr/permissions/:id`: Get permission (`view_permissions`).
- `PUT /hr/permissions/:id`: Update permission (`manage_permissions`).
- `DELETE /hr/permissions/:id`: Soft-delete permission (`manage_permissions`).

#### Workflows (/hr/workflows)
- `POST /hr/workflows`: Create workflow (`manage_workflows`).
- `POST /hr/workflows/:id/steps`: Add step (`manage_workflows`).
- `PUT /hr/workflows/:id/cancel`: Cancel workflow (`manage_workflows`).
- `GET /hr/workflows/:id`: Get workflow (`view_workflows`).
- `GET /hr/workflows`: List workflows (`view_workflows`).

#### Notifications (/hr/notifications)
- `GET /hr/notifications`: List notifications (`view_all_notifications`).
- `POST /hr/notifications`: Create notification (`manage_notifications`).
- `PATCH /hr/notifications/:id/seen`: Mark as seen (Ownership check).
- `DELETE /hr/notifications/:id`: Soft-delete notification (Ownership check).
- `GET /hr/notifications/user/:userId`: Get user notifications (Ownership or `view_all_notifications`).
- `GET /hr/notifications/:id`: Get notification (Ownership check).

#### Admins (/hr/admins)
- `GET /hr/admins`: List admins (`view_admins`).
- `POST /hr/admins`: Create admin (`manage_admins`).
- `GET /hr/admins/:id`: Get admin (`view_admins`).
- `PUT /hr/admins/:id`: Update admin (`manage_admins`).
- `DELETE /hr/admins/:id`: Soft-delete admin (`manage_admins`).
- `PUT /hr/admins/:id/undelete`: Undelete admin (`manage_admins`).

### Shop (/shop)
#### Categories (/shop/categories)
- `GET /shop/categories`: List categories (Authenticated).
- `POST /shop/categories`: Create category (`"Manage Shop"`).
- `GET /shop/categories/:id`: Get category (Authenticated).
- `PUT /shop/categories/:id`: Update category (`"Manage Shop"`).
- `DELETE /shop/categories/:id`: Soft-delete category (`"Manage Shop"`).

#### SubCategories (/shop/subcategories)
- `GET /shop/subcategories`: List subcategories (Authenticated).
- `POST /shop/subcategories`: Create subcategory (`"Manage Shop"`).
- `GET /shop/subcategories/:id`: Get subcategory (Authenticated).
- `PUT /shop/subcategories/:id`: Update subcategory (`"Manage Shop"`).
- `DELETE /shop/subcategories/:id`: Soft-delete subcategory (`"Manage Shop"`).

#### Brands (/shop/brands)
- `GET /shop/brands`: List brands (Authenticated).
- `POST /shop/brands`: Create brand (`"Manage Shop"`).
- `GET /shop/brands/:id`: Get brand (Authenticated).
- `PUT /shop/brands/:id`: Update brand (`"Manage Shop"`).
- `DELETE /shop/brands/:id`: Soft-delete brand (`"Manage Shop"`).

#### Products (/shop/products)
- `GET /shop/products`: List products (Authenticated).
- `POST /shop/products`: Create product (`"Manage Shop"`).
- `GET /shop/products/:id`: Get product (Authenticated).
- `PUT /shop/products/:id`: Update product (`"Manage Shop"`).
- `DELETE /shop/products/:id`: Soft-delete product (`"Manage Shop"`).

#### Orders (/shop/orders)
- `GET /shop/orders`: List orders (`view_orders`, Scoped).
- `POST /shop/orders`: Create order (Authenticated, Scoped).
- `GET /shop/orders/:id`: Get order (`view_orders`, Scoped).
- `PUT /shop/orders/:id`: Update order (`update_orders`, Scoped).
- `DELETE /shop/orders/:id`: Soft-delete order (`delete_orders`, Scoped).
- `GET /shop/orders/user/:userId`: Get user orders (Ownership or `view_users`).

#### Carts (/shop/carts)
- `GET /shop/carts`: List carts (`view_carts`, Scoped).
- `POST /shop/carts`: Add to cart (Authenticated).
- `GET /shop/carts/:id`: Get cart (Ownership or `view_carts`).
- `PUT /shop/carts/:id`: Update cart (Ownership).
- `DELETE /shop/carts/:id`: Soft-delete cart item (Ownership).
- `GET /shop/carts/user/:userId`: Get user cart (Ownership or `view_carts`).
- `DELETE /shop/carts/clear/:id`: Clear cart (Ownership).

#### Banners (/shop/banners)
- `GET /shop/banners`: List banners (Authenticated).
- `POST /shop/banners`: Create banner (`"Manage Shop"`).
- `GET /shop/banners/:id`: Get banner (Authenticated).
- `PUT /shop/banners/:id`: Update banner (`"Manage Shop"`).
- `DELETE /shop/banners/:id`: Soft-delete banner (`"Manage Shop"`).

### Activation (/activation)
- `GET /activation/companies`: List companies (Authenticated).
- `POST /activation/companies`: Create company (`manage_companies`).
- `GET /activation/companies/:id`: Get company (Authenticated).
- `PUT /activation/companies/:id`: Update company (`manage_companies`).
- `DELETE /activation/companies/:id`: Soft-delete company (`manage_companies`).

#### Tariffs (/activation/tariffs)
- `GET /activation/tariffs`: List tariffs (Authenticated).
- `POST /activation/tariffs`: Create tariff (`manage_tariffs`).
- `GET /activation/tariffs/:id`: Get tariff (Authenticated).
- `PUT /activation/tariffs/:id`: Update tariff (`manage_tariffs`).
- `DELETE /activation/tariffs/:id`: Soft-delete tariff (`manage_tariffs`).

#### Tariff Options (/activation/tarrifoptions)
- `GET /activation/tarrifoptions`: List tariff options (Authenticated).
- `POST /activation/tarrifoptions`: Create tariff option (`manage_tariffs`).
- `GET /activation/tarrifoptions/:id`: Get tariff option (Authenticated).
- `PUT /activation/tarrifoptions/:id`: Update tariff option (`manage_tariffs`).
- `DELETE /activation/tarrifoptions/:id`: Soft-delete tariff option (`manage_tariffs`).

#### SIM Serials (/activation/simserials)
- `GET /activation/simserials`: List SIM serials (`view_sim_serials`).
- `POST /activation/simserials`: Create SIM serial (`manage_sim_serials`).
- `GET /activation/simserials/:id`: Get SIM serial (`view_sim_serials`).
- `PUT /activation/simserials/:id`: Update SIM serial (`manage_sim_serials`).
- `DELETE /activation/simserials/:id`: Soft-delete SIM serial (`manage_sim_serials`).

#### Serial Numbers (/activation/serialnumbers)
- `GET /activation/serialnumbers`: List serial numbers (`view_serial_numbers`, Scoped).
- `POST /activation/serialnumbers`: Create serial number (`manage_serial_numbers`, Scoped).
- `PUT /activation/serialnumbers/:id`: Update serial number (`manage_serial_numbers`, Scoped).
- `DELETE /activation/serialnumbers/:id`: Soft-delete serial number (`manage_serial_numbers`, Scoped).
- `GET /activation/serialnumbers/dealer/:dealerId`: Get dealer serial numbers (`view_serial_numbers`, Scoped).
- `GET /activation/serialnumbers/company/:companyId`: Get company serial numbers (`view_serial_numbers`, Scoped).
- `GET /activation/serialnumbers/nonactivated`: Get non-activated serial numbers (`view_serial_numbers`, Scoped).

#### Activations (/activation/activations)
- `GET /activation/activations`: List activations (`view_activations`, Scoped).
- `POST /activation/activations`: Create activation (`create_activations`, Scoped).
- `GET /activation/activations/:id`: Get activation (`view_activations`, Scoped).
- `PUT /activation/activations/:id`: Update activation (`update_activations`, Scoped).
- `DELETE /activation/activations/:id`: Soft-delete activation (`delete_activations`, Scoped).
- `GET /activation/activations/user/:userId`: Get user activations (`view_activations`, Scoped).

### Dealers (/dealers)
- `GET /dealers`: List dealers (`view_dealers`, Scoped).
- `POST /dealers`: Create dealer (`create_dealers`, Scoped).
- `GET /dealers/:id`: Get dealer (`view_dealers`, Scoped).
- `PUT /dealers/:id`: Update dealer (`update_dealers`, Scoped).
- `DELETE /dealers/:id`: Soft-delete dealer (`delete_dealers`, Scoped).
- `PUT /dealers/:id/undelete`: Undelete dealer (`manage_dealers`).

#### Documents (/dealers/documents)
- `POST /dealers/documents`: Create document (`manage_dealer_documents`, Scoped).
- `GET /dealers/documents/:dealerId`: Get dealer documents (`view_dealer_documents`, Scoped).
- `DELETE /dealers/documents/:id`: Soft-delete document (`manage_dealer_documents`, Scoped).

#### Billing Address (/dealers/billingaddress)
- `GET /dealers/billingaddress/:dealerId`: Get billing address (`view_dealer_billing`, Scoped).
- `PUT /dealers/billingaddress/:dealerId`: Update billing address (`manage_dealer_billing`, Scoped).
- `DELETE /dealers/billingaddress/:dealerId`: Soft-delete billing address (`manage_dealer_billing`, Scoped).

#### Credit Details (/dealers/creditdetails)
- `GET /dealers/creditdetails/:dealerId`: Get credit details (`view_dealer_credit`, Scoped).
- `PUT /dealers/creditdetails/:dealerId`: Update credit details (`manage_dealer_credit`, Scoped).
- `DELETE /dealers/creditdetails/:dealerId`: Soft-delete credit details (`manage_dealer_credit`, Scoped).

#### Sale Points (/dealers/salepoint)
- `GET /dealers/salepoint/dealer/:dealerId`: Get dealer sale points (`view_dealer_salepoints`, Scoped).
- `GET /dealers/salepoint/:id`: Get sale point (`view_dealer_salepoints`, Scoped).
- `POST /dealers/salepoint`: Create sale point (`manage_dealer_salepoints`, Scoped).
- `PUT /dealers/salepoint/:id`: Update sale point (`manage_dealer_salepoints`, Scoped).
- `DELETE /dealers/salepoint/:id`: Soft-delete sale point (`manage_dealer_salepoints`, Scoped).

#### Signed Contracts (/dealers/signedcontract)
- `GET /dealers/signedcontract/dealer/:dealerId`: Get dealer contracts (`view_dealer_contracts`, Scoped).
- `GET /dealers/signedcontract/:id`: Get contract (`view_dealer_contracts`, Scoped).
- `POST /dealers/signedcontract`: Create contract (`manage_dealer_contracts`, Scoped).
- `PUT /dealers/signedcontract/:id`: Update contract (`manage_dealer_contracts`, Scoped).
- `DELETE /dealers/signedcontract/:id`: Soft-delete contract (`manage_dealer_contracts`, Scoped).

### Library / Utilities (/lib)
- `POST /lib/upload`: Upload asset (`upload_assets`, Scoped).
- `GET /lib/assets`: List assets (`view_assets`, Scoped).
- `DELETE /lib/assets/:publicId`: Delete asset (`manage_assets`).
- `POST /lib/mail`: Send email (`send_emails`).
- `GET /lib/pdf_image`: Generate PDF (`generate_pdfs`).

### Analytics (/analytics)
- `GET /analytics/sales`: Sales analytics (`view_sales_analytics`, Scoped).
- `GET /analytics/products`: Product analytics (`view_product_analytics`, Scoped).
- `GET /analytics/users`: User analytics (`view_user_analytics`, Scoped).
- `GET /analytics/dealers`: Dealer analytics (`view_dealer_analytics`, Scoped).
- `GET /analytics/activations`: Activation analytics (`view_activation_analytics`, Scoped).
- `GET /analytics/forecast`: Revenue forecast (`view_revenue_forecast`, Scoped).

## 6. Error Handling

- **200 OK**: Success.
- **201 Created**: Resource created.
- **400 Bad Request**: Invalid input.
- **401 Unauthorized**: Authentication failed (invalid/expired token, deleted user).
- **403 Forbidden**: Insufficient permissions.
- **404 Not Found**: Resource not found, soft-deleted, or inaccessible due to scoping.
- **409 Conflict**: Unique constraint violation (e.g., duplicate email).
- **500 Internal Server Error**: Server error.

**Error Format**:
```json
{
  "error": "Descriptive error message"
}
```
or
```json
{
  "message": "Descriptive message"
}
```

## 7. Usage Guides (Administrators/Managers)

### 7.1. Managing Users
- **View Active Users**: `GET /users` (`view_users`). Returns non-deleted users.
- **View Specific User**: `GET /users/:id` (`view_users`). 404 if deleted.
- **Create User**: `POST /hr/admins` (`manage_admins`) or other endpoints.
- **Update User**: `PUT /users/:id` (`manage_users`). Can update deleted users.
- **Soft-Delete User**: `DELETE /users/:id` (`manage_users`). Sets `deletedAt`.
- **Undelete User**: `PUT /users/:id/undelete` (`manage_users`). 404 if not deleted.
- **Login**: `POST /auth/login`. Only active users.
- **Password Reset**: `POST /auth/password/forgot` (active users), `POST /auth/password/reset` (undeletes user).

### 7.2. Managing Roles and Permissions
- **View Active Roles**: `GET /hr/roles` (`view_roles`). Non-deleted roles and permissions.
- **View Specific Role**: `GET /hr/roles/:id` (`view_roles`). 404 if deleted.
- **Create Role**: `POST /hr/roles` (`manage_roles`).
- **Update Role**: `PUT /hr/roles/:id` (`manage_roles`).
- **Soft-Delete Role**: `DELETE /hr/roles/:id` (`manage_roles`). Users lose permissions.
- **View Active Permissions**: `GET /hr/permissions` (`view_permissions`).
- **Create Permission**: `POST /hr/permissions` (`manage_permissions`).
- **Update Permission**: `PUT /hr/permissions/:id` (`manage_permissions`).
- **Soft-Delete Permission**: `DELETE /hr/permissions/:id` (`manage_permissions`).
- **Assign Permissions**: `POST /hr/roles/:roleId/permissions` (`assign_permissions`). Replaces existing assignments.

### 7.3. Managing Dealer-Specific Data
- **Global Admin**: Use global permissions (e.g., `view_dealers`) to access any dealer’s data.
- **Dealer User**: Scoped permissions restrict to `req.user.dealerId`.
  - **List Data**: `GET /dealers/salepoint/dealer/:dealerId` verifies `dealerId` match.
  - **Single Item**: `GET /dealers/salepoint/:id` checks item ownership.
  - **Create Item**: `POST /dealers/salepoint` links to `dealerId`.
  - **Update/Delete**: Verify item belongs to `dealerId`.

## 8. Getting Started (Developers)

1. **Obtain API Access**:
   - Register or use existing credentials.
   - Use `POST /auth/login` to get `access_token` and `refresh_token`.

2. **Make Authenticated Requests**:
   - Include `Authorization: Bearer <access_token>` in headers.

3. **Handle Token Expiry**:
   - On 401 "Access token expired", use `POST /auth/refresh-token`.
   - If refresh token fails, re-login.

4. **Handle Authorization Errors**:
   - 403 Forbidden indicates missing permissions. Verify required permissions.

5. **Handle Soft Deletion**:
   - GET requests return active data only.
   - Use `PUT /:id/undelete` or `PUT /:id` with `{"deletedAt": null}` to undelete.

6. **Implement Scoping**:
   - For Dealer Users, ensure UI uses scoped endpoints/parameters. API enforces `dealerId` filtering.