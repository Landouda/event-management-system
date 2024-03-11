import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { DateSelect } from "../utils/date-select";
import { CategorySelect } from "../utils/category-select";

export default function AddEvent() {
 
  
  return (
    <form className={cn("grid items-start gap-4",)}>
    <div className="grid gap-2">
      <Label>Title</Label>
      <Input type="text" defaultValue="" />
    </div>
    <div className="grid gap-2">
      <Label>Description</Label>
      <Input type="text" defaultValue="" />
    </div>
    <div className="grid gap-2">
      <Label>Date</Label>
      <DateSelect />
    </div>
    <div className="grid gap-2">
      <Label>time</Label>
      <Input type="text" defaultValue="" />
    </div>
    <div className="grid gap-2">
      <Label>Category</Label>
      <CategorySelect />
    </div>
    <div className="grid gap-2">
      <Label>Location</Label>
      <Input type="text" defaultValue="" />
    </div>
    <Button type="submit">Save changes</Button>
  </form>
  );
}

  
