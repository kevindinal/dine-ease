"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SpecialOffer {
  id: string
  title: string
  description: string
  discount: string
  code: string
  validUntil: string
}

interface SpecialOffersProps {
  offers: SpecialOffer[]
  onApplyCode: (code: string) => void
}

export default function SpecialOffers({ offers, onApplyCode }: SpecialOffersProps) {
  if (offers.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
        <h3 className="font-semibold text-amber-800">Special Offers Available</h3>
      </div>
      <div className="grid gap-2">
        {offers.slice(0, 1).map((offer) => (
          <div key={offer.id} className="flex justify-between items-center">
            <div>
              <p className="text-sm text-amber-700">
                {offer.title}: <span className="font-medium">{offer.discount} off</span>
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Use code: <span className="font-mono font-medium">{offer.code}</span>
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => onApplyCode(offer.code)}
            >
              Apply
            </Button>
          </div>
        ))}
      </div>
      {offers.length > 1 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-xs text-amber-700 p-0 h-auto mt-2">
              View all {offers.length} offers
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                Special Offers
              </DialogTitle>
              <DialogDescription>Apply these offers when making your reservation</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {offers.map((offer) => (
                <div key={offer.id} className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{offer.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {offer.discount}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">
                        Valid until {new Date(offer.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onApplyCode(offer.code)}>
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

