// prisma/seed.js (or seed.ts)

// Import your Prisma client instance
// Adjust the import path based on where your prisma client instance is exported
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding permissions and roles...");

  // --- 1. Define all Permissions ---
  // This list should match the permission names used in checkPermission calls
  const permissionsData = [
    {
      name: "assign_permissions",
      description: "Allows assigning/removing permissions to roles",
    },
    { name: "create_dealers", description: "Allows creating new dealers" },
    { name: "delete_dealers", description: "Allows soft-deleting dealers" },
    {
      name: "delete_permissions",
      description: "Allows soft-deleting permissions",
    },
    { name: "delete_roles", description: "Allows soft-deleting roles" },
    {
      name: "generate_pdfs",
      description: "Allows generating PDFs from images",
    },
    { name: "manage_admins", description: "Allows managing admin users" },
    { name: "manage_assets", description: "Allows deleting assets" }, // Global asset deletion
    {
      name: "manage_dealer_billing",
      description: "Allows managing dealer billing addresses",
    },
    {
      name: "manage_dealer_contracts",
      description: "Allows managing dealer contracts",
    },
    {
      name: "manage_dealer_credit",
      description: "Allows managing dealer credit details",
    },
    {
      name: "manage_dealer_documents",
      description: "Allows managing dealer documents",
    },
    {
      name: "manage_dealer_salepoints",
      description: "Allows managing dealer sale points",
    },
    {
      name: "manage_notifications",
      description: "Allows sending notifications",
    },
    { name: "manage_permissions", description: "Allows managing permissions" },
    { name: "manage_roles", description: "Allows managing roles" },
    { name: "manage_users", description: "Allows managing general users" },
    { name: "manage_workflows", description: "Allows managing workflows" },
    { name: "send_emails", description: "Allows sending emails" },
    {
      name: "Manage Shop",
      description:
        "Allows managing shop entities (categories, products, brands)",
    }, // Keep exact string from code
    { name: "update_dealers", description: "Allows updating dealers" }, // Can be covered by manage_dealers
    { name: "update_permissions", description: "Allows updating permissions" }, // Can be covered by manage_permissions
    { name: "update_roles", description: "Allows updating roles" }, // Can be covered by manage_roles
    { name: "update_workflows", description: "Allows updating workflows" }, // Can be covered by manage_workflows
    { name: "upload_assets", description: "Allows uploading assets" },
    {
      name: "view_activation_analytics",
      description: "Allows viewing activation analytics",
    },
    {
      name: "view_all_notifications",
      description: "Allows viewing all notifications",
    },
    { name: "view_admins", description: "Allows viewing admin users" },
    { name: "view_assets", description: "Allows viewing assets" }, // Global asset viewing
    {
      name: "view_dealer_analytics",
      description: "Allows viewing dealer analytics",
    },
    {
      name: "view_dealer_billing",
      description: "Allows viewing dealer billing addresses",
    },
    {
      name: "view_dealer_contracts",
      description: "Allows viewing dealer contracts",
    },
    {
      name: "view_dealer_credit",
      description: "Allows viewing dealer credit details",
    },
    {
      name: "view_dealer_documents",
      description: "Allows viewing dealer documents",
    },
    { name: "view_dealers", description: "Allows viewing dealers" },
    {
      name: "view_dealer_salepoints",
      description: "Allows viewing dealer sale points",
    },
    { name: "view_permissions", description: "Allows viewing permissions" }, // Can be covered by manage_permissions
    {
      name: "view_product_analytics",
      description: "Allows viewing product analytics",
    },
    {
      name: "view_revenue_forecast",
      description: "Allows viewing revenue forecast",
    },
    { name: "view_roles", description: "Allows viewing roles" }, // Can be covered by manage_roles
    {
      name: "view_sales_analytics",
      description: "Allows viewing sales analytics",
    },
    {
      name: "view_user_analytics",
      description: "Allows viewing user analytics",
    },
    { name: "view_users", description: "Allows viewing general users" },
    { name: "view_workflows", description: "Allows viewing workflows" },
    // Add any other permissions if they were added elsewhere (e.g., manage_companies, view_sim_serials, etc.)
    { name: "manage_companies", description: "Allows managing companies" },
    {
      name: "view_sim_serials",
      description: "Allows viewing SIM serial numbers",
    },
    {
      name: "manage_sim_serials",
      description: "Allows managing SIM serial numbers",
    },
    {
      name: "view_serial_numbers",
      description: "Allows viewing Serial Numbers",
    },
    {
      name: "manage_serial_numbers",
      description: "Allows managing Serial Numbers",
    },
    { name: "view_activations", description: "Allows viewing Activations" },
    { name: "create_activations", description: "Allows creating Activations" },
    { name: "update_activations", description: "Allows updating Activations" },
    { name: "delete_activations", description: "Allows deleting Activations" },
    { name: "view_tariffs", description: "Allows viewing Tariffs" }, // Added based on activation routes
    {
      name: "manage_tariffs",
      description: "Allows managing Tariffs and Tariff Options",
    }, // Added based on activation routes
    { name: "view_carts", description: "Allows viewing Carts" }, // Added based on shop routes
    { name: "manage_carts", description: "Allows managing Carts" }, // Added based on shop routes
    { name: "view_orders", description: "Allows viewing individual orders" },
    { name: "create_orders", description: "Allows creating new orders" },
    { name: "update_orders", description: "Allows updating existing orders" },
    { name: "delete_orders", description: "Allows soft-deleting orders" },
    { name: "view_companies", description: "Allows viewing companies" },
  ];

  // Use a Map to store created/found permissions for easy lookup by name
  const seededPermissions = new Map();

  console.log("Seeding Permissions...");
  for (const permData of permissionsData) {
    try {
      const permission = await prisma.permission.upsert({
        where: { name: permData.name },
        update: {}, // Don't update if it already exists
        create: permData,
      });
      seededPermissions.set(permission.name, permission);
      // console.log(`Upserted permission: "${permission.name}"`);
    } catch (error) {
      console.error(`Error upserting permission "${permData.name}":`, error);
    }
  }
  console.log(`Finished seeding ${seededPermissions.size} permissions.`);

  // --- 2. Define all Roles and their Permissions ---
  // Keys are Role names, values are arrays of Permission names
  const rolesWithPermissions = {
    SuperAdmin: permissionsData.map((p) => p.name), // SuperAdmin gets all permissions
    Admin: [
      "manage_users",
      "view_users",
      "manage_admins",
      "view_admins",
      "manage_roles",
      "view_roles",
      "assign_permissions",
      "manage_permissions",
      "view_permissions",
      "manage_workflows",
      "view_workflows", // Global workflow management
      "manage_notifications",
      "view_all_notifications",
      "upload_assets",
      "view_assets",
      "manage_assets", // Global asset management
      "send_emails",
      "generate_pdfs", // Utility
      "Manage Shop", // Global shop management
      "view_sales_analytics",
      "view_product_analytics",
      "view_user_analytics",
      "view_dealer_analytics",
      "view_activation_analytics",
      "view_revenue_forecast", // Global analytics
      "view_dealers", // Can view all dealers globally
      "view_orders", // Can view all orders globally
      "view_sim_serials", // Can view all sim serials globally
      "view_serial_numbers", // Can view all serial numbers globally
      "view_activations", // Can view all activations globally
      "view_tariffs",
      "manage_tariffs", // Can manage tariffs
      "view_companies",
      "manage_companies", // Can manage companies (assuming these permissions)
      "view_carts",
      "manage_carts", // Can manage carts globally (assuming these permissions)
    ],
    SalesManager: [
      "Manage Shop", // Global shop management
      "view_dealers",
      "create_dealers",
      "update_dealers",
      "delete_dealers", // Global dealer management (soft delete)
      "view_dealer_billing",
      "manage_dealer_billing", // Global
      "view_dealer_contracts",
      "manage_dealer_contracts", // Global
      "view_dealer_credit",
      "manage_dealer_credit", // Global
      "view_dealer_documents",
      "manage_dealer_documents", // Global
      "view_dealer_salepoints",
      "manage_dealer_salepoints", // Global
      "upload_assets",
      "view_assets", // Can upload/view global assets (e.g. for products)
      "send_emails",
      "generate_pdfs", // Utility
      "view_sales_analytics",
      "view_product_analytics",
      "view_dealer_analytics",
      "view_revenue_forecast", // Global analytics
      "view_orders",
      "create_orders",
      "update_orders",
      "delete_orders", // Global order management (soft delete)
      "view_tariffs",
      "manage_tariffs",
      "view_companies",
      "manage_companies",
      "view_sim_serials",
      "manage_sim_serials",
      "view_serial_numbers",
      "manage_serial_numbers",
      "view_activations",
      "create_activations",
      "update_activations",
      "delete_activations",
      "view_carts",
      "manage_carts",
    ],
    ShopManager: [
      "Manage Shop", // Global shop management
      "upload_assets",
      "view_assets",
      "manage_assets", // Global asset management for products
      "view_product_analytics", // Product analytics
      "view_tariffs", // View tariffs for product info
      "view_companies", // View companies for product info
      "view_sim_serials", // View sim serials related to products/activations
      "view_serial_numbers", // View serial numbers
      "view_activations", // View activations related to products
      "view_orders", // View orders related to products
    ],
    DealerViewer: [
      "view_dealers", // Scoped view of their own dealer
      "view_dealer_billing", // Scoped
      "view_dealer_credit", // Scoped
      "view_dealer_documents", // Scoped
      "view_dealer_salepoints", // Scoped
      "view_dealer_contracts", // Scoped
      "view_orders", // Scoped to orders by their dealer's users
      "view_workflows", // Scoped to workflows for their dealer
      "view_assets", // Scoped to their dealer's assets
      "view_user_analytics", // Scoped to users under their dealer
      "view_sales_analytics", // Scoped to sales for their dealer
      "view_product_analytics", // Scoped to products ordered by their dealer
      "view_dealer_analytics", // Scoped to their dealer's stats
      "view_activation_analytics", // Scoped to activations by their dealer
      "view_revenue_forecast", // Scoped to revenue from their dealer
      "view_tariffs", // Can view global tariffs
      "view_companies", // Can view global companies
      "view_sim_serials", // Can view serials relevant to their dealer (scoped in controller)
      "view_serial_numbers", // Can view serial numbers relevant to their dealer (scoped in controller)
      "view_activations", // Can view activations relevant to their dealer (scoped in controller)
      "view_carts", // Can view carts relevant to their dealer (scoped in controller)
    ],
    DealerSales: [
      // Includes DealerViewer permissions +
      "view_dealers",
      "view_dealer_billing",
      "view_dealer_credit",
      "view_dealer_documents",
      "view_dealer_salepoints",
      "view_dealer_contracts",
      "view_orders",
      "view_workflows",
      "view_assets",
      "view_user_analytics",
      "view_sales_analytics",
      "view_product_analytics",
      "view_dealer_analytics",
      "view_activation_analytics",
      "view_revenue_forecast",
      "view_tariffs",
      "view_companies",
      "view_sim_serials",
      "view_serial_numbers",
      "view_activations",
      "view_carts",

      "manage_dealer_documents", // Scoped
      "manage_dealer_salepoints", // Scoped
      "manage_dealer_contracts", // Scoped
      "create_orders", // Scoped
      "update_orders", // Scoped
      "delete_orders", // Scoped
      "manage_workflows", // Scoped for order/activation workflows
      "upload_assets", // Scoped
    ],
    DealerActivator: [
      // Includes relevant DealerViewer permissions +
      "view_dealers",
      "view_dealer_documents",
      "view_dealer_salepoints",
      "view_dealer_contracts",
      "view_orders",
      "view_workflows",
      "view_assets",
      "view_tariffs",
      "view_companies",
      "view_sim_serials",
      "view_serial_numbers",
      "view_activations",
      "view_product_analytics",
      "view_dealer_analytics",
      "view_activation_analytics", // Analytics relevant to activations

      "manage_dealer_documents", // Scoped
      "update_orders", // Scoped (for activation status updates)
      "delete_orders", // Scoped (for cancelling orders related to activations)
      "manage_workflows", // Scoped (for activation workflows)
      "upload_assets", // Scoped (for activation documents)
      // May also need create/update for Activations themselves if that's a separate endpoint/permission
      // 'create_activations', 'update_activations', 'delete_activations'
    ],
    DealerAccounts: [
      // Includes relevant DealerViewer permissions +
      "view_dealers",
      "view_dealer_billing",
      "view_dealer_credit",
      "view_dealer_documents",
      "view_dealer_salepoints",
      "view_dealer_contracts",
      "view_orders",
      "view_workflows",
      "view_user_analytics",
      "view_sales_analytics",
      "view_dealer_analytics",
      "view_revenue_forecast",
      "view_tariffs",
      "view_companies",
      "view_carts", // View tariffs/companies/carts related to orders/billing

      "manage_dealer_billing", // Scoped
      "manage_dealer_credit", // Scoped
      "manage_dealer_documents", // Scoped
      "manage_dealer_contracts", // Scoped
      "update_orders", // Scoped (for payment status updates)
      "delete_orders", // Scoped (for certain order statuses)
      "upload_assets", // Scoped (for payment proofs)
    ],
    DealerManager: [
      // Broad access within the dealer's scope
      "view_dealers",
      "update_dealers",
      "delete_dealers", // Scoped Dealer management
      "view_dealer_billing",
      "manage_dealer_billing", // Scoped
      "view_dealer_credit",
      "manage_dealer_credit", // Scoped
      "view_dealer_documents",
      "manage_dealer_documents", // Scoped
      "view_dealer_salepoints",
      "manage_dealer_salepoints", // Scoped
      "view_dealer_contracts",
      "manage_dealer_contracts", // Scoped
      "view_orders",
      "create_orders",
      "update_orders",
      "delete_orders", // Scoped Order management
      "view_workflows",
      "manage_workflows", // Scoped Workflow management
      "view_assets",
      "upload_assets", // Scoped Asset management
      "view_user_analytics",
      "view_sales_analytics",
      "view_product_analytics",
      "view_dealer_analytics",
      "view_activation_analytics",
      "view_revenue_forecast", // Scoped Analytics
      "view_tariffs",
      "manage_tariffs", // Manage tariffs relevant to their dealer? (Global permission, needs thought) -> Let's keep as global manage, view as global
      "view_companies",
      "manage_companies", // Manage companies? -> Let's keep as global
      "view_sim_serials",
      "manage_sim_serials", // Manage Sim Serials relevant to dealer? -> Let's keep as global manage, view scoped
      "view_serial_numbers",
      "manage_serial_numbers", // Manage Serial Numbers -> Let's keep as global manage, view scoped
      "view_activations",
      "create_activations",
      "update_activations",
      "delete_activations", // Manage Activations -> Scoped
      "view_carts",
      "manage_carts", // Manage Carts -> Scoped
    ],
    User: [
      // Basic authenticated user - minimal permissions checked by checkPermission
      // Most access is via controller logic checking req.user.id
      "view_tariffs", // Can view global tariffs
      "view_companies", // Can view global companies
      // Access to products/categories/brands is authenticated but no specific permission check in code
      // 'view_products', 'view_categories', 'view_brands' // Add these permissions and checks if needed
    ],
  };

  // Use a Map to store created/found roles for easy lookup by name
  const seededRoles = new Map();

  console.log("Seeding Roles...");
  for (const roleName in rolesWithPermissions) {
    try {
      const role = await prisma.role.upsert({
        where: { name: roleName },
        update: { description: rolesWithPermissions[roleName].description }, // Update description if role exists (add description field to rolesWithPermissions)
        create: { name: roleName, description: `${roleName} role` }, // Add a default description
      });
      seededRoles.set(role.name, role);
      // console.log(`Upserted role: "${role.name}"`);
    } catch (error) {
      console.error(`Error upserting role "${roleName}":`, error);
    }
  }
  // Handle the basic 'User' role separately if it wasn't included in the object keys
  if (!seededRoles.has("User")) {
    try {
      const userRole = await prisma.role.upsert({
        where: { name: "User" },
        update: {},
        create: { name: "User", description: "Basic authenticated user" },
      });
      seededRoles.set(userRole.name, userRole);
      // console.log(`Upserted role: "User"`);
    } catch (error) {
      console.error(`Error upserting role "User":`, error);
    }
  }

  console.log(`Finished seeding ${seededRoles.size} roles.`);

  // --- 3. Assign Permissions to Roles ---
  console.log("Assigning Permissions to Roles...");
  for (const roleName in rolesWithPermissions) {
    const permissionNamesForRole = rolesWithPermissions[roleName];
    const role = seededRoles.get(roleName);

    if (!role) {
      console.warn(
        `Skipping permission assignment for role "${roleName}": Role not found.`
      );
      continue;
    }

    // Get the actual Permission objects based on the names
    const permissionsToConnect = permissionNamesForRole
      .map((permName) => seededPermissions.get(permName))
      .filter((perm) => perm !== undefined); // Filter out any permission names that weren't successfully seeded

    // Ensure all permission names for this role were actually found
    if (permissionsToConnect.length !== permissionNamesForRole.length) {
      const foundPermNames = permissionsToConnect.map((p) => p.name);
      const missingPermNames = permissionNamesForRole.filter(
        (name) => !foundPermNames.includes(name)
      );
      console.warn(
        `Warning: Some permissions for role "${roleName}" were not found during assignment: ${missingPermNames.join(
          ", "
        )}`
      );
      // Continue assignment with the permissions found
    }

    console.log(
      `Assigning ${permissionsToConnect.length} permissions to role: "${role.name}"`
    );

    try {
      // Connect permissions to the role.
      // Using `set` will disconnect any existing permissions and connect only the ones provided.
      // If you want to only *add* and *remove* explicitly based on delta, the logic is more complex.
      // `set` is good for ensuring the role has *exactly* the listed permissions.
      await prisma.role.update({
        where: { id: role.id },
        data: {
          permissions: {
            set: permissionsToConnect.map((p) => ({ id: p.id })),
          },
        },
      });
      console.log(`Permissions assigned for role: "${role.name}"`);
    } catch (error) {
      console.error(
        `Error assigning permissions for role "${roleName}":`,
        error
      );
    }
  }

  // Assign permissions for the basic 'User' role if it exists
  const basicUserRole = seededRoles.get("User");
  if (basicUserRole) {
    const basicUserPermissions = [
      "view_tariffs", // Can view global tariffs
      "view_companies", // Can view global companies
      // Add other permissions basic users need checkPermission for
    ];
    const permissionsToConnect = basicUserPermissions
      .map((permName) => seededPermissions.get(permName))
      .filter((perm) => perm !== undefined);

    if (permissionsToConnect.length !== basicUserPermissions.length) {
      const foundPermNames = permissionsToConnect.map((p) => p.name);
      const missingPermNames = basicUserPermissions.filter(
        (name) => !foundPermNames.includes(name)
      );
      console.warn(
        `Warning: Some permissions for basic "User" role were not found during assignment: ${missingPermNames.join(
          ", "
        )}`
      );
    }

    console.log(
      `Assigning ${permissionsToConnect.length} permissions to role: "${basicUserRole.name}"`
    );
    try {
      await prisma.role.update({
        where: { id: basicUserRole.id },
        data: {
          permissions: {
            set: permissionsToConnect.map((p) => ({ id: p.id })),
          },
        },
      });
      console.log(`Permissions assigned for role: "${basicUserRole.name}"`);
    } catch (error) {
      console.error(
        `Error assigning permissions for basic "User" role:`,
        error
      );
    }
  }

  console.log("Finished seeding permissions and roles.");
}

// Standard Prisma seeding execution
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
