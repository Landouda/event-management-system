import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategorySelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value="conference">Conference</SelectItem>
          <SelectItem value="seminar">Seminar</SelectItem>
          <SelectItem value="workshop">Workshop</SelectItem>
          <SelectItem value="webinar">Webinar</SelectItem>
          <SelectItem value="concert">Concert</SelectItem>
          <SelectItem value="festival">Festival</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
