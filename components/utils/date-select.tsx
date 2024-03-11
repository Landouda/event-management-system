"use client"
 

import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState } from "react"
 
const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})
 
export function DateSelect() {
  const[date,setDate]=useState(new Date())

  return (
    
     
              <Popover>
                <PopoverTrigger asChild>
                  {/* <FormControl> */}
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        
                      )}
                    >
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  {/* </FormControl> */}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    // onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
  )
}