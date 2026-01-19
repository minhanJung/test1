"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

export function PetFilters() {
  const [petType, setPetType] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Card className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름, 품종, 지역으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">종류:</Label>
            <Select value={petType} onValueChange={setPetType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="dog">강아지</SelectItem>
                <SelectItem value="cat">고양이</SelectItem>
                  </SelectContent>
                </Select>
              </div>
        </div>
      </CardContent>
    </Card>
  )
}
