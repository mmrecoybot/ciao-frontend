const prisma = require("../../prisma");
const logWorkflowStep = async ({
  workflowId,
  action,
  actorId,
  actorRole,
  metadata,
}) => {
  return await prisma.workflowStep.create({
    data: {
      workflowId,
      action,
      actorId,
      actorRole,
      metadata,
    },
  });
};
module.exports = logWorkflowStep;

// const EventEmitter = require("events");
// const workflowEvents = new EventEmitter();

// workflowEvents.on(
//   "orderUpdated",
//   async ({ workflowId, action, actorId, actorRole, metadata }) => {
//     await logWorkflowStep({ workflowId, action, actorId, actorRole, metadata });
//   }
// );

// const workflowEvents = require("./workflowEvents");

// // Example: On order cancellation
// workflowEvents.emit("orderUpdated", {
//   workflowId: order.workflowId,
//   action: "Order Canceled",
//   actorId: req.user.id,
//   actorRole: req.user.role,
//   metadata: { reason: "Customer Request" },
// });

// module.exports = workflowEvents;

// const workflowActions = {
//   "Order Placed": "create",
//   "Order Updated": "update",
//   "Order Canceled": "cancel",
// };

// async function handleWorkflowAction(
//   action,
//   workflowId,
//   actorId,
//   actorRole,
//   metadata = {}
// ) {
//   if (workflowActions[action]) {
//     await logWorkflowStep({
//       workflowId,
//       action,
//       actorId,
//       actorRole,
//       metadata,
//     });
//   }
// }
// await handleWorkflowAction(
//   "Order Updated",
//   workflow.id,
//   req.user.id,
//   req.user.role,
//   { changes: updatedFields }
// );
