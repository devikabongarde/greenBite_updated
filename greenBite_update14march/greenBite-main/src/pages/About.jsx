import { useMemo } from 'react';
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function About() {
  const cards = useMemo(() => [
    {
      title: "Reduce Food Waste with GreenBite",
      content: "GreenBite is your smart companion for managing food efficiently and reducing waste. Track your food inventory, receive timely expiration alerts, and explore creative recipes to make the most of your leftovers."
    },
    {
      title: "Why Choose GreenBite?",
      content: (
        <ul className="text-gray-600 space-y-2">
          <li><strong>Smart Food Tracking:</strong> Easily manage and monitor your food inventory.</li>
          <li><strong>Timely Expiry Alerts:</strong> Get notified before food goes bad to reduce waste.</li>
          <li><strong>AI-Powered Recipe Suggestions:</strong> Turn leftovers into tasty meals effortlessly.</li>
          <li><strong>Eco-Friendly Impact:</strong> Save money, reduce food waste, and help the planet.</li>
          <li><strong>Community Engagement:</strong> Share tips, recipes, and food-saving hacks with others.</li>
          <li><strong>Seamless Grocery Integration:</strong> Plan shopping based on existing inventory.</li>
          <li><strong>Analytics & Insights:</strong> Gain insights into your food consumption habits.</li>
          <li><strong>Multi-User Support:</strong> Share your account with family members for collaborative tracking.</li>
        </ul>
      )
    },
    {
      title: "How It Works",
      content: (
        <ol className="text-gray-600 space-y-2 list-decimal pl-6">
          <li>Scan and log your groceries to track their shelf life.</li>
          <li>Receive real-time alerts before items expire.</li>
          <li>Discover recipe suggestions tailored to your available ingredients.</li>
          <li>Engage with the community to share insights and reduce waste collectively.</li>
          <li>Monitor your food usage trends with detailed analytics.</li>
          <li>Connect with local food donation services to share excess food.</li>
        </ol>
      )
    },
    {
      title: "Our Vision for a Sustainable Future",
      content: "Food waste is a global challenge, and GreenBite is here to make a difference. By leveraging technology, we empower individuals and families to take control of their food consumption, minimize waste, and make sustainable choices. Together, we can create a future where no food goes to waste!"
    },
    {
      title: "Join the Green Movement",
      content: "Every small step towards reducing food waste makes a difference. GreenBite empowers you to take charge of your kitchen, minimize waste, and contribute to a healthier environment. Let's make sustainable eating a part of our everyday lives!"
    }
  ], []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white shadow-md px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">About</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {cards.map((card, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={index === 0 ? "text-3xl font-bold" : "text-2xl font-semibold"}>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                {card.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default About;
