const prisma = require("../../lib/prisma")
const asyncHandler = require('express-async-handler')

const ReOrderBoards = asyncHandler(async (req, res) => {
     const { boardId } = req.params;
     const { columnOrderData } = req.body;

     try {
          if (!boardId || !columnOrderData || !Array.isArray(columnOrderData)) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid data provided. Board ID and column order data are required.'
               });
          }

          const existingColumns = await prisma.column.findMany({
               where: { boardId },
               select: { id: true }
          });

          const existingColumnIds = existingColumns.map(col => col.id);
          const providedColumnIds = columnOrderData.map(item => item.id);
          const invalidIds = providedColumnIds.filter(id => !existingColumnIds.includes(id));

          if (invalidIds.length > 0) {
               return res.status(400).json({
                    success: false,
                    message: `Invalid column IDs: ${invalidIds.join(', ')}`
               });
          }

          const result = await prisma.$transaction(async (prisma) => {
               // Update both orderId and order fields
               const updatePromises = columnOrderData.map(({ id, orderId, order }, index) => {
                    return prisma.column.update({
                         where: { id },
                         data: {
                              orderId: orderId?.toString() || (index + 1).toString(),
                              order: order || (index + 1)  // Add numeric order field
                         }
                    });
               });

               await Promise.all(updatePromises);

               // Return columns sorted by the new order
               return await prisma.column.findMany({
                    where: { boardId },
                    orderBy: { order: 'asc' }, // Sort by numeric order instead of string orderId
                    include: {
                         Task: {
                              orderBy: { createdAt: 'asc' }
                         }
                    }
               });
          });

          res.status(200).json({
               success: true,
               message: 'Columns reordered successfully',
               columns: result
          });

     } catch (error) {
          console.error('Error reordering columns:', error);
          res.status(500).json({
               success: false,
               message: 'Internal server error while reordering columns'
          });
     }
})

module.exports = { ReOrderBoards }