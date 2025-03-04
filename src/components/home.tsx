import React, { useState, useEffect } from "react";
import Header from "./Header";
import ConversionInterface from "./ConversionInterface";
import ConversionHistory from "./ConversionHistory";
import AuthenticationModal from "./AuthenticationModal";
import Calculator from "./Calculator";
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

  // Fetch conversion history from Supabase
  const fetchConversionHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("conversion_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedHistory: ConversionHistoryItem[] = data.map((item) => ({
          id: item.id,
          timestamp: new Date(item.created_at),
          category: item.category,
          fromValue: parseFloat(item.from_value),
          fromUnit: item.from_unit,
          toValue: parseFloat(item.to_value),
          toUnit: item.to_unit,
        }));
        setConversionHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Error fetching conversion history:", error);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUser(data.session.user);
        // Fetch user's conversion history
        fetchConversionHistory(data.session.user.id);
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
          fetchConversionHistory(session.user.id);
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

  const handleSaveConversion = async (conversionData: {
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

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from("conversion_history")
        .insert({
          user_id: user.id,
          category: conversionData.category,
          from_value: conversionData.sourceValue,
          from_unit: conversionData.sourceUnit,
          to_value: conversionData.targetValue,
          to_unit: conversionData.targetUnit,
        })
        .select();

      if (error) throw error;

      // Create a new history item for the UI
      const newHistoryItem: ConversionHistoryItem = {
        id: data[0].id,
        timestamp: new Date(data[0].created_at),
        category: conversionData.category,
        fromValue: conversionData.sourceValue,
        fromUnit: conversionData.sourceUnit,
        toValue: conversionData.targetValue,
        toUnit: conversionData.targetUnit,
      };

      setConversionHistory([newHistoryItem, ...conversionHistory]);
    } catch (error) {
      console.error("Error saving conversion:", error);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from("conversion_history")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setConversionHistory(conversionHistory.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting conversion history item:", error);
    }
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

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        <div className="w-full">
          <ConversionInterface
            initialCategory={selectedCategory}
            onSaveConversion={handleSaveConversion}
            isAuthenticated={isAuthenticated}
          />
        </div>
        <div className="w-full max-w-xl mx-auto mt-4">
          <Calculator />
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
            We use cookies to enhance your experience – by continuing, you agree
            to our use of cookies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
