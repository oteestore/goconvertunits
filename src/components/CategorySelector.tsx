import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface CategorySelectorProps {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories = [
    "Length",
    "Weight",
    "Temperature",
    "Volume",
    "Speed",
    "Area",
    "Time",
  ],
  selectedCategory = "Length",
  onCategoryChange = () => {},
}) => {
  return (
    <div className="w-full">
      <Tabs
        defaultValue={selectedCategory}
        onValueChange={onCategoryChange}
        className="w-full"
      >
        <TabsList className="w-full flex overflow-x-auto justify-start mb-2">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-shrink-0 text-[#0f172a] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategorySelector;
