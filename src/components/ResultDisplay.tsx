import React from "react";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ArrowRight } from "lucide-react";

interface ResultDisplayProps {
  sourceValue?: string | number;
  sourceUnit?: string;
  targetValue?: string | number;
  targetUnit?: string;
  formula?: string;
  isLoading?: boolean;
  onSave?: () => void;
  isAuthenticated?: boolean;
}

const ResultDisplay = ({
  sourceValue = "1",
  sourceUnit = "meter",
  targetValue = "3.28084",
  targetUnit = "feet",
  formula = "1 meter = 3.28084 feet",
  isLoading = false,
  onSave = () => {},
  isAuthenticated = false,
}: ResultDisplayProps) => {
  return (
    <Card className="w-full p-6 bg-white shadow-sm border-gray-100">
      <div className="flex flex-col space-y-4">
        {/* Main conversion result display */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">From</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{sourceValue}</span>
              <span className="text-gray-600">{sourceUnit}</span>
            </div>
          </div>

          <ArrowRight className="text-gray-400 h-6 w-6" />

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">To</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  targetValue
                )}
              </span>
              <span className="text-gray-600">{targetUnit}</span>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Formula display and save button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Formula:</span> {formula}
          </div>
          <button
            onClick={onSave}
            className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
            title={
              isAuthenticated
                ? "Save this conversion"
                : "Sign in to save conversions"
            }
          >
            {isAuthenticated ? "Save" : "Sign in to save"}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ResultDisplay;
