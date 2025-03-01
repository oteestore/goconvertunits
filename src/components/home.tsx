import React, { useState, useEffect } from "react";
import Header from "./Header";
import ConversionInterface from "./ConversionInterface";
import ConversionHistory from "./ConversionHistory";
import AuthenticationModal from "./AuthenticationModal";
import { supabase } from "../lib/supabase";

interface ConversionHistoryItem {
  id: string;
  timestamp: Date;
  category: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
}

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [conversionHistory, setConversionHistory] = useState<
    ConversionHistoryItem[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("length");

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUser(data.session.user);
        // Here you would fetch the user's conversion history from your database
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setIsAuthenticated(true);
          setUser(session.user);
          // Fetch user's conversion history
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUser(null);
          setConversionHistory([]);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = () => {
    setAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setConversionHistory([]);
  };

  const handleAuthSuccess = (session: any) => {
    setIsAuthenticated(true);
    setUser(session.user);
    setAuthModalOpen(false);
    // Fetch user's conversion history
  };

  const handleSaveConversion = (conversionData: {
    sourceValue: number;
    sourceUnit: string;
    targetValue: number;
    targetUnit: string;
    category: string;
  }) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    // In a real app, you would save this to your database
    const newHistoryItem: ConversionHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      category: conversionData.category,
      fromValue: conversionData.sourceValue,
      fromUnit: conversionData.sourceUnit,
      toValue: conversionData.targetValue,
      toUnit: conversionData.targetUnit,
    };

    setConversionHistory([newHistoryItem, ...conversionHistory]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    // In a real app, you would delete this from your database
    setConversionHistory(conversionHistory.filter((item) => item.id !== id));
  };

  const handleLoadConversion = (item: ConversionHistoryItem) => {
    // Set the category and other conversion parameters
    setSelectedCategory(item.category.toLowerCase());
    // In a real app, you would pass the conversion details to the ConversionInterface
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        userName={user?.user_metadata?.full_name || user?.email || "User"}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <ConversionInterface
            initialCategory={selectedCategory}
            onSaveConversion={handleSaveConversion}
          />
        </div>

        <div className="lg:w-1/3">
          <ConversionHistory
            historyItems={conversionHistory}
            onLoadConversion={handleLoadConversion}
            onDeleteItem={handleDeleteHistoryItem}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </main>

      <AuthenticationModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} GoConvertUnits. All rights reserved.
          </p>
          <p className="mt-2">
            A clean, minimalist unit conversion application inspired by Notion's
            design aesthetic.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
