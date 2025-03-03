import React, { useState, useEffect } from "react";
import CategorySelector from "./CategorySelector";
import ConversionForm from "./ConversionForm";
import ResultDisplay from "./ResultDisplay";
import ConversionHistory from "./ConversionHistory";
import { Card } from "./ui/card";

interface ConversionInterfaceProps {
  initialCategory?: string;
  onSaveConversion?: (conversionData: {
    sourceValue: number;
    sourceUnit: string;
    targetValue: number;
    targetUnit: string;
    category: string;
  }) => void;
  isAuthenticated?: boolean;
}

const ConversionInterface: React.FC<ConversionInterfaceProps> = ({
  initialCategory = "length",
  onSaveConversion = () => {},
  isAuthenticated = false,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [conversionResult, setConversionResult] = useState<number>(0);
  const [sourceValue, setSourceValue] = useState<number>(1);
  const [sourceUnit, setSourceUnit] = useState<string>("");
  const [targetUnit, setTargetUnit] = useState<string>("");
  const [formula, setFormula] = useState<string>("");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleResultChange = (
    result: number,
    fromValue: number,
    fromUnit: string,
    toUnit: string,
  ) => {
    setConversionResult(result);
    setSourceValue(fromValue);
    setSourceUnit(fromUnit);
    setTargetUnit(toUnit);

    // Generate formula text
    const formattedResult = result.toLocaleString(undefined, {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
    });
    setFormula(`${fromValue} ${fromUnit} = ${formattedResult} ${toUnit}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Unit Converter
        </h2>
        <p className="text-gray-500 mb-6">
          Quick and accurate unit conversions
        </p>

        <div className="space-y-6">
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <ConversionForm
            category={selectedCategory}
            onResultChange={handleResultChange}
          />

          <ResultDisplay
            sourceValue={sourceValue}
            sourceUnit={sourceUnit}
            targetValue={conversionResult}
            targetUnit={targetUnit}
            formula={formula}
            onSave={() => {
              onSaveConversion({
                sourceValue,
                sourceUnit,
                targetValue: conversionResult,
                targetUnit,
                category: selectedCategory,
              });
            }}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      <div className="mt-6">
        <ConversionHistory
          historyItems={[]}
          onLoadConversion={() => {}}
          onDeleteItem={() => {}}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
};

export default ConversionInterface;
