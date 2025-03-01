import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Clock, Trash2, ArrowUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ConversionHistoryItem {
  id: string;
  timestamp: Date;
  category: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
}

interface ConversionHistoryProps {
  historyItems?: ConversionHistoryItem[];
  onLoadConversion?: (item: ConversionHistoryItem) => void;
  onDeleteItem?: (id: string) => void;
  isAuthenticated?: boolean;
}

const ConversionHistory: React.FC<ConversionHistoryProps> = ({
  historyItems = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      category: "Length",
      fromValue: 10,
      fromUnit: "meter",
      toValue: 32.8084,
      toUnit: "foot",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      category: "Weight",
      fromValue: 5,
      fromUnit: "kilogram",
      toValue: 11.0231,
      toUnit: "pound",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      category: "Temperature",
      fromValue: 25,
      fromUnit: "celsius",
      toValue: 77,
      toUnit: "fahrenheit",
    },
  ],
  onLoadConversion = () => {},
  onDeleteItem = () => {},
  isAuthenticated = true,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete);
      setItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full h-full bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Clock className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-medium">Conversion History</h3>
          <p className="text-sm text-gray-500">
            Sign in to save and view your conversion history
          </p>
          <Button variant="outline" className="mt-2">
            Sign In
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Conversion History
          </h3>
        </div>

        {historyItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No conversion history yet</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="space-y-3">
              {historyItems.map((item) => (
                <div key={item.id} className="group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{formatTime(item.timestamp)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {item.fromValue} {item.fromUnit}
                        </span>
                        <ArrowUpRight className="h-3 w-3 text-gray-400" />
                        <span className="font-medium">
                          {item.toValue} {item.toUnit}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onLoadConversion(item)}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Load conversion</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversion from your history?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ConversionHistory;
