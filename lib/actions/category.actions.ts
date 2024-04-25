export interface ICategory {
  id: string;
  name: string;
}

export const getAllCategories = (): ICategory[] => {
  return [
    {
      id: "1",
      name: "Conference",
    },
    {
      id: "2",
      name: "Seminar",
    },
    {
      id: "3",
      name: "Workshop",
    },
    {
      id: "4",
      name: "Webinar",
    },
    {
      id: "5",
      name: "Concert",
    },
    {
      id: "6",
      name: "Festival",
    },
  ];
};
