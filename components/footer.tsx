"use client"

import { usePOS } from "@/context/pos-context"
import { OrderFooter } from "./order-footer"

export function Footer() {
  const { orders } = usePOS()

  // Get the 3 most recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3)

  return (
    <div className="bg-white border-t p-4 flex gap-4">
      {recentOrders.length === 0 ? (
        <div className="text-center text-gray-500 w-full py-2">No recent orders. Place an order to see it here.</div>
      ) : (
        recentOrders.map((order) => (
          <div key={order.id} className="flex-1">
            <OrderFooter
              tableNumber={order.tableNumber}
              items={order.items}
              kitchen={order.kitchen}
              process={order.status === "Processing"}
            />
          </div>
        ))
      )}
    </div>
  )
}

