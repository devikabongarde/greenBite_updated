import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { onValue, ref } from "firebase/database";
import { database, auth } from "../firebaseConfig.js";

 
function Chatbot() {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;
   const userId = user ? user.uid : null;

  useEffect(() => {
    const foodItemsRef = ref(database, `users/${userId}/foodItems`);
    onValue(foodItemsRef, (snapshot) => {
      const items = [];
      snapshot.forEach((childSnapshot) => {
        items.push(childSnapshot.val().name.toLowerCase());
      });
      setFoodItems(items);
    });
  }, [userId]);

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const fetchRecipes = async () => {
    if (selectedIngredients.length === 0) return;
  
    setLoading(true);
    const apiKey = "fd29b3c4549145cc8f9571156bd14cd5";
    const ingredientString = selectedIngredients.join(",");
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientString}&number=5&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Fetch full details for each recipe to get sourceUrl
      const fullRecipes = await Promise.all(
        data.map(async (recipe) => {
          const detailsResponse = await fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
          );
          const details = await detailsResponse.json();
          return { ...recipe, sourceUrl: details.sourceUrl };
        })
      );
  
      setRecipes(fullRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Recipe Generator
                </BreadcrumbLink>
              </BreadcrumbItem>
              
            </BreadcrumbList>
          </Breadcrumb>
          
        </div>
      </header>
    
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Select Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          {foodItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {foodItems.map((item, index) => (
                <Button
                  key={index}
                  variant={selectedIngredients.includes(item) ? "default" : "outline"}
                  className="px-4 py-2"
                  onClick={() => toggleIngredient(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No ingredients available.</p>
          )}
          <Button className="mt-4" onClick={fetchRecipes} disabled={selectedIngredients.length === 0}>
            Get Recipes
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Suggested Recipes</CardTitle>
        </CardHeader>
        <CardContent>
  {loading ? (
    <div className="flex justify-center items-center py-4">
      <p className="text-gray-500 animate-pulse text-lg">Fetching recipes...</p>
    </div>
  ) : recipes.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recipes.map((recipe, index) => (
        <div 
          key={index} 
          className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 hover:shadow-xl transition duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
          <div className="mt-2 flex justify-between items-center">
            <a 
              href={recipe.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-300"
            >
              View Recipe
            </a>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-4">
      <p className="text-gray-500 text-lg">No recipes found. Try selecting different ingredients!</p>
    </div>
  )}
</CardContent>

      </Card>
    </SidebarInset>
  </SidebarProvider>
  )
}

export default Chatbot