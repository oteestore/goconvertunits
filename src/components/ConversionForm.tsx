import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "./ui/button";

interface ConversionFormProps {
  category?: string;
  onResultChange?: (
    result: number,
    fromValue: number,
    fromUnit: string,
    toUnit: string,
  ) => void;
}

interface UnitOption {
  value: string;
  label: string;
  conversionFactor: number;
}

const getUnitOptions = (category: string): UnitOption[] => {
  switch (category) {
    case "length":
      return [
        { value: "meter", label: "Meters (m)", conversionFactor: 1 },
        {
          value: "kilometer",
          label: "Kilometers (km)",
          conversionFactor: 0.001,
        },
        {
          value: "centimeter",
          label: "Centimeters (cm)",
          conversionFactor: 100,
        },
        {
          value: "millimeter",
          label: "Millimeters (mm)",
          conversionFactor: 1000,
        },
        { value: "inch", label: "Inches (in)", conversionFactor: 39.3701 },
        { value: "foot", label: "Feet (ft)", conversionFactor: 3.28084 },
        { value: "yard", label: "Yards (yd)", conversionFactor: 1.09361 },
        { value: "mile", label: "Miles (mi)", conversionFactor: 0.000621371 },
      ];
    case "weight":
      return [
        { value: "kilogram", label: "Kilograms (kg)", conversionFactor: 1 },
        { value: "gram", label: "Grams (g)", conversionFactor: 1000 },
        {
          value: "milligram",
          label: "Milligrams (mg)",
          conversionFactor: 1000000,
        },
        { value: "pound", label: "Pounds (lb)", conversionFactor: 2.20462 },
        { value: "ounce", label: "Ounces (oz)", conversionFactor: 35.274 },
        { value: "ton", label: "Tons (t)", conversionFactor: 0.001 },
      ];
    case "temperature":
      return [
        { value: "celsius", label: "Celsius (°C)", conversionFactor: 1 },
        { value: "fahrenheit", label: "Fahrenheit (°F)", conversionFactor: 1 },
        { value: "kelvin", label: "Kelvin (K)", conversionFactor: 1 },
      ];
    case "volume":
      return [
        { value: "liter", label: "Liters (L)", conversionFactor: 1 },
        {
          value: "milliliter",
          label: "Milliliters (mL)",
          conversionFactor: 1000,
        },
        { value: "gallon", label: "Gallons (gal)", conversionFactor: 0.264172 },
        { value: "quart", label: "Quarts (qt)", conversionFactor: 1.05669 },
        { value: "pint", label: "Pints (pt)", conversionFactor: 2.11338 },
        { value: "cup", label: "Cups (cup)", conversionFactor: 4.22675 },
        {
          value: "fluid_ounce",
          label: "Fluid Ounces (fl oz)",
          conversionFactor: 33.814,
        },
      ];
    case "speed":
      return [
        {
          value: "meter_per_second",
          label: "Meters per second (m/s)",
          conversionFactor: 1,
        },
        {
          value: "kilometer_per_hour",
          label: "Kilometers per hour (km/h)",
          conversionFactor: 3.6,
        },
        {
          value: "mile_per_hour",
          label: "Miles per hour (mph)",
          conversionFactor: 2.23694,
        },
        { value: "knot", label: "Knots (kn)", conversionFactor: 1.94384 },
      ];
    default:
      return [
        { value: "meter", label: "Meters (m)", conversionFactor: 1 },
        {
          value: "kilometer",
          label: "Kilometers (km)",
          conversionFactor: 0.001,
        },
      ];
  }
};

const convertValue = (
  value: number,
  fromUnit: string,
  toUnit: string,
  category: string,
): number => {
  if (category === "temperature") {
    // Special handling for temperature conversions
    if (fromUnit === "celsius" && toUnit === "fahrenheit") {
      return (value * 9) / 5 + 32;
    } else if (fromUnit === "celsius" && toUnit === "kelvin") {
      return value + 273.15;
    } else if (fromUnit === "fahrenheit" && toUnit === "celsius") {
      return ((value - 32) * 5) / 9;
    } else if (fromUnit === "fahrenheit" && toUnit === "kelvin") {
      return ((value - 32) * 5) / 9 + 273.15;
    } else if (fromUnit === "kelvin" && toUnit === "celsius") {
      return value - 273.15;
    } else if (fromUnit === "kelvin" && toUnit === "fahrenheit") {
      return ((value - 273.15) * 9) / 5 + 32;
    } else {
      return value; // Same unit
    }
  } else {
    // For other categories, use conversion factors
    const units = getUnitOptions(category);
    const fromUnitData = units.find((unit) => unit.value === fromUnit);
    const toUnitData = units.find((unit) => unit.value === toUnit);

    if (!fromUnitData || !toUnitData) return value;

    // Convert to base unit then to target unit
    const valueInBaseUnit = value / fromUnitData.conversionFactor;
    return valueInBaseUnit * toUnitData.conversionFactor;
  }
};

const ConversionForm: React.FC<ConversionFormProps> = ({
  category = "length",
  onResultChange = () => {},
}) => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<number>(0);
  const [unitOptions, setUnitOptions] = useState<UnitOption[]>([]);

  useEffect(() => {
    const options = getUnitOptions(category);
    setUnitOptions(options);

    // Set default units when category changes
    if (options.length > 0) {
      setFromUnit(options[0].value);
      setToUnit(options.length > 1 ? options[1].value : options[0].value);
    }
  }, [category]);

  useEffect(() => {
    if (fromUnit && toUnit && inputValue) {
      const numericValue = parseFloat(inputValue) || 0;
      const convertedValue = convertValue(
        numericValue,
        fromUnit,
        toUnit,
        category,
      );
      setResult(convertedValue);
      onResultChange(convertedValue, numericValue, fromUnit, toUnit);
    }
  }, [inputValue, fromUnit, toUnit, category, onResultChange]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="value-input"
            className="text-sm font-medium text-gray-700"
          >
            Value
          </label>
          <Input
            id="value-input"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">From</label>
            <div className="grid grid-cols-1 gap-2">
              {unitOptions.map((unit) => (
                <Button
                  key={unit.value}
                  variant={fromUnit === unit.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFromUnit(unit.value)}
                  className="w-full"
                >
                  {unit.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapUnits}
              className="rounded-full h-10 w-10 flex items-center justify-center"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To</label>
            <div className="grid grid-cols-1 gap-2">
              {unitOptions.map((unit) => (
                <Button
                  key={unit.value}
                  variant={toUnit === unit.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setToUnit(unit.value)}
                  className="w-full"
                >
                  {unit.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionForm;
