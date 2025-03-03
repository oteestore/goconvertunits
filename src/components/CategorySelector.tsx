import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Ruler,
  Weight,
  Thermometer,
  Droplet,
  Gauge,
  SquareAsterisk,
  Clock,
} from "lucide-react";

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
              {category === "Length" && <Ruler className="h-4 w-4 mr-2" />}
              {category === "Weight" && <Weight className="h-4 w-4 mr-2" />}
              {category === "Temperature" && (
                <Thermometer className="h-4 w-4 mr-2" />
              )}
              {category === "Volume" && <Droplet className="h-4 w-4 mr-2" />}
              {category === "Speed" && <Gauge className="h-4 w-4 mr-2" />}
              {category === "Area" && (
                <SquareAsterisk className="h-4 w-4 mr-2" />
              )}
              {category === "Time" && <Clock className="h-4 w-4 mr-2" />}
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategorySelector;
