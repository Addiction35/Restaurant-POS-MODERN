"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Banknote, Edit2, Trash2 } from "lucide-react"
import { usePOS } from "@/context/pos-context"
import { CartItem } from "./cart-item"
import { DiningMode } from "./dining-mode"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function Cart() {
  const { cart, activeTable, subtotal, tax, total, placeOrder, removeFromCart } = usePOS()

  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    if (!activeTable) {
      toast({
        title: "No table selected",
        description: "Please select a table before placing an order.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const order = await placeOrder()
      if (order) {
        toast({
          title: "Order placed successfully",
          description: `Order #${order.id} has been sent to the kitchen.`,
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error placing order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Table {activeTable?.number || "-"}</h2>
          <p className="text-sm text-gray-500">{activeTable?.customer || "-"}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 border-b">
        <DiningMode />
      </div>
      <div className="flex-1 overflow-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Your cart is empty. Add items to get started.</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="relative">
              <CartItem title={item.title} price={item.price} quantity={item.quantity} image={item.image} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sub Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax 5%</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Amount</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button variant="outline" className="flex flex-col items-center py-2">
            <Banknote className="h-5 w-5 mb-1" />
            <span className="text-xs">Cash</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center py-2">
            <CreditCard className="h-5 w-5 mb-1" />
            <span className="text-xs">Card</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center py-2">
            <QrCode className="h-5 w-5 mb-1" />
            <span className="text-xs">QR Code</span>
          </Button>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
          onClick={handlePlaceOrder}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
      <Toaster />
    </div>
  )
}

