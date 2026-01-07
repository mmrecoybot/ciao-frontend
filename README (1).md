# Application Permission System (RBAC with Soft Delete and Scoping)

This document provides a comprehensive overview of the Role-Based Access Control (RBAC) system for the application, detailing permissions, suggested roles, and the mechanics of access control, soft deletion, and dealer-specific data scoping.

## Core Concepts

The RBAC system integrates soft deletion and dealer-specific scoping:

- **Role-Based Access**: Users are assigned one Role, which holds multiple Permissions. Users can perform actions if their Role has the required Permission.
- **Soft Deletion Integration**:
  - The `authenticateToken` middleware ensures the User is not soft-deleted (`User.deletedAt IS NULL`).
  - The `checkPermission` middleware verifies the User's Role and the required Permission are not soft-deleted (`Role.deletedAt IS NULL`, `Permission.deletedAt IS NULL`).
- **Dealer-Specific Scoping**: For Users with a `dealerId`, certain permissions are scoped to their dealer's data. The `checkPermission` middleware confirms capability, while controllers enforce scoping via `req.user.dealerId` filters.

## Permissions List

Permissions are granular capabilities, typically following a `verb_resource` or `verb_resource_subresource` naming convention. Below is the complete list with their scope status.

| Permission Name               | Description                                                                 | Scope Status |
|-------------------------------|-----------------------------------------------------------------------------|--------------|
| assign_permissions            | Assign/remove permissions to/from roles                                     | Not Scoped   |
| create_dealers                | Create new Dealer entities                                                  | Scoped       |
| delete_dealers                | Soft-delete Dealer entities                                                 | Scoped       |
| delete_permissions            | Soft-delete Permission entities                                             | Not Scoped   |
| delete_roles                  | Soft-delete Role entities                                                   | Not Scoped   |
| generate_pdfs                 | Generate PDFs from image URLs                                               | Not Scoped   |
| manage_admins                 | Manage (view, create, update, soft-delete, undelete) admins                 | Not Scoped   |
| manage_assets                 | Delete Cloudinary assets                                                    | Not Scoped   |
| manage_dealer_billing         | Manage (view, create, update, soft-delete) billing address                  | Scoped       |
| manage_dealer_contracts       | Manage (view, create, update, soft-delete) signed contracts                 | Scoped       |
| manage_dealer_credit          | Manage (view, create, update, soft-delete) credit details                   | Scoped       |
| manage_dealer_documents       | Manage (view, create, soft-delete) dealer documents                         | Scoped       |
| manage_dealer_salepoints      | Manage (view, create, update, soft-delete) sale points                      | Scoped       |
| manage_notifications          | Create (send) notifications                                                 | Not Scoped   |
| manage_permissions            | Manage (view, create, update, soft-delete) Permission entities              | Not Scoped   |
| manage_roles                  | Manage (view, create, update, soft-delete) Role entities                    | Not Scoped   |
| manage_users                  | Manage (view, create, update, soft-delete, undelete) general Users          | Not Scoped   |
| manage_workflows              | Manage (view, create, add steps, cancel) Workflows                          | Scoped       |
| send_emails                   | Send emails via the application                                             | Not Scoped   |
| "Manage Shop"                 | Manage (view, create, update, soft-delete) Shop entities                    | Not Scoped   |
| update_dealers                | Update Dealer entities                                                      | Scoped       |
| upload_assets                 | Upload assets to Cloudinary                                                 | Scoped       |
| view_activation_analytics     | View Activation analytics                                                   | Scoped       |
| view_all_notifications        | View all system notifications                                               | Not Scoped   |
| view_admins                   | View system administrators                                                  | Not Scoped   |
| view_assets                   | View (list) assets on Cloudinary                                            | Scoped       |
| view_dealer_analytics         | View Dealer analytics                                                       | Scoped       |
| view_dealer_billing           | View billing address                                                        | Scoped       |
| view_dealer_contracts         | View signed contracts                                                       | Scoped       |
| view_dealer_credit            | View credit details                                                         | Scoped       |
| view_dealer_documents         | View dealer documents                                                       | Scoped       |
| view_dealers                  | View Dealer entities                                                        | Scoped       |
| view_dealer_salepoints        | View sale points                                                            | Scoped       |
| view_product_analytics        | View Product analytics                                                      | Scoped       |
| view_revenue_forecast         | View Revenue Forecast data                                                  | Scoped       |
| view_sales_analytics          | View Sales analytics                                                        | Scoped       |
| view_user_analytics           | View User analytics                                                         | Scoped       |
| view_users                    | View general User entities                                                  | Not Scoped   |
| view_workflows                | View Workflow entities                                                      | Scoped       |

**Note**: Permissions like `update_permissions`, `update_roles`, `view_permissions`, `view_roles`, and `update_workflows` are covered by `manage_permissions`, `manage_roles`, or `manage_workflows`.

## Suggested Roles and Permissions Mapping

Below is the mapping of permissions to suggested roles, with scoping indicated for dealer-specific roles.

| Permission Name               | SuperAdmin | Admin | SalesManager | ShopManager | Dealer Viewer | Dealer Sales | Dealer Activator | Dealer Accounts | Dealer Manager |
|-------------------------------|------------|-------|--------------|-------------|---------------|--------------|------------------|-----------------|---------------|
| assign_permissions            | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| create_dealers                | Yes        | No    | Yes          | No          | No            | No           | No               | No              | Yes (Scoped)  |
| delete_dealers                | Yes        | No    | Yes          | No          | No            | No           | No               | No              | Yes (Scoped)  |
| delete_permissions            | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| delete_roles                  | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| generate_pdfs                 | Yes        | Yes   | Yes          | No          | No            | No           | No               | No              | Yes           |
| manage_admins                 | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| manage_assets                 | Yes        | Yes   | Yes          | Yes         | No            | No           | No               | No              | Yes           |
| manage_dealer_billing         | Yes        | No    | Yes          | No          | No            | No           | No               | Yes (Scoped)    | Yes (Scoped)  |
| manage_dealer_contracts       | Yes        | No    | Yes          | No          | No            | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| manage_dealer_credit          | Yes        | No    | Yes          | No          | No            | No           | No               | Yes (Scoped)    | Yes (Scoped)  |
| manage_dealer_documents       | Yes        | No    | Yes          | No          | No            | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| manage_dealer_salepoints      | Yes        | No    | Yes          | No          | No            | Yes (Scoped) | No               | No              | Yes (Scoped)  |
| manage_notifications          | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| manage_permissions            | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| manage_roles                  | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| manage_users                  | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| manage_workflows              | Yes        | Yes   | No           | No          | No            | Yes (Scoped) | Yes (Scoped)     | No              | Yes (Scoped)  |
| send_emails                   | Yes        | Yes   | Yes          | No          | No            | No           | No               | No              | Yes           |
| "Manage Shop"                 | Yes        | Yes   | Yes          | Yes         | No            | No           | No               | No              | No            |
| update_dealers                | Yes        | No    | Yes          | No          | No            | No           | No               | No              | Yes (Scoped)  |
| upload_assets                 | Yes        | Yes   | Yes          | Yes         | No            | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_activation_analytics     | Yes        | Yes   | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_all_notifications        | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| view_admins                   | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| view_assets                   | Yes        | Yes   | Yes          | Yes         | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_dealer_analytics         | Yes        | Yes   | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_dealer_billing           | Yes        | No    | Yes          | No          | Yes (Scoped)  | No           | No               | Yes (Scoped)    | Yes (Scoped)  |
| view_dealer_contracts         | Yes        | No    | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_dealer_credit            | Yes        | No    | Yes          | No          | Yes (Scoped)  | No           | No               | Yes (Scoped)    | Yes (Scoped)  |
| view_dealer_documents         | Yes        | No    | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_dealers                  | Yes        | Yes   | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_dealer_salepoints        | Yes        | No    | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | No               | No              | Yes (Scoped)  |
| view_product_analytics        | Yes        | Yes   | Yes          | Yes         | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_revenue_forecast         | Yes        | Yes   | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_sales_analytics          | Yes        | Yes   | Yes          | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_user_analytics           | Yes        | Yes   | No           | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |
| view_users                    | Yes        | Yes   | No           | No          | No            | No           | No               | No              | No            |
| view_workflows                | Yes        | Yes   | No           | No          | Yes (Scoped)  | Yes (Scoped) | Yes (Scoped)     | Yes (Scoped)    | Yes (Scoped)  |

## Self-Service Actions

Certain actions are controlled by controller logic rather than permissions, requiring only `authenticateToken` and ownership checks:

- `GET /auth/user/me`: View own profile.
- `PUT /auth/password/change`: Change own password.
- `GET /hr/notifications/user/:userId`: View own notifications.
- `PATCH /hr/notifications/:id/seen`: Mark own notification as seen.
- `DELETE /hr/notifications/:id`: Soft-delete own notification.
- `GET /shop/carts/user/:userId`: View own cart.
- `POST /shop/carts`: Add to own cart.
- `PUT /shop/carts/:id`: Update own cart item.
- `DELETE /shop/carts/:id`: Soft-delete own cart item.
- `DELETE /shop/carts/clear/:id`: Clear own cart.
- `GET /shop/orders/user/:userId`: View own orders.
- `POST /shop/orders`: Place own order.

## Soft Deletion Impact

- **Users**: Soft-deleted Users (`User.deletedAt IS NOT NULL`) cannot log in or access protected routes (`authenticateToken` fails).
- **Roles**: Soft-deleted Roles (`Role.deletedAt IS NOT NULL`) render assigned Users permissionless (`checkPermission` filters out the Role).
- **Permissions**: Soft-deleted Permissions (`Permission.deletedAt IS NOT NULL`) are excluded from Roles (`checkPermission` filters them out).
- **Scoped Permissions**: For Dealer Users, scoped permissions are further restricted if the target resource is soft-deleted, as controllers include `where: { deletedAt: null }`.

## Management Guide

Permissions and Roles are managed via `/hr` endpoints, typically by users with `manage_roles` and `manage_permissions` (e.g., Admin, SuperAdmin).

- **Create Permissions**: `POST /hr/permissions` with `name` and optional `description`. Creates non-deleted permissions.
- **Create Roles**: `POST /hr/roles` with `name` and optional `description`. Creates non-deleted roles.
- **Assign Permissions**: `POST /hr/roles/:roleId/permissions` with `permissionIds` array. Replaces existing assignments.
- **Remove Permission**: `DELETE /hr/roles/:roleId/permissions/:permissionId`. Soft-deletes the assignment.
- **Assign Role to User**: Set `roleId` during user creation/update (`/hr/admins`, `/users`). Assign `dealerId` for dealer-specific users.
- **View/Update/Delete**: Use `GET`, `PUT`, `DELETE` endpoints under `/hr/roles`, `/hr/permissions`, `/hr/users`. Deletion sets `deletedAt`.

## Technical Implementation

- **Models**: Include `deletedAt` (DateTime?) for User, Role, Permission, and other entities.
- **authenticateToken Middleware**: Verifies User with `where: { deletedAt: null }`, attaches non-deleted User and Role to `req.user`.
- **checkPermission Middleware**: Checks Role and Permissions with `where: { deletedAt: null }`, ensuring the required Permission is active.
- **Controller Logic (Scoping)**: For dealer-associated resources, controllers add `where: { dealerId: req.user.dealerId }` if `req.user.dealerId` is set. Global users (no `dealerId`) operate without this filter.
- **Controller Logic (Soft Delete)**:
  - GET: Filter `where: { deletedAt: null }` for main and related entities.
  - PUT/PATCH: Query by ID, allow updating `deletedAt` for undeleting.
  - DELETE: Use UPDATE to set `deletedAt`, with `where: { deletedAt: null }` to avoid re-deletion (returns 404 if already deleted).
  - Creation: Set `deletedAt` to null.
- **Transactions**: Multi-step operations (e.g., order creation, product deletion with variations) use `$transaction` for atomicity.

This RBAC system ensures flexible, secure access control, seamlessly integrating soft deletion and dealer-specific scoping for robust data isolation.