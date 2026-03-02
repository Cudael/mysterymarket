import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Star, TrendingUp } from "lucide-react";

interface TopIdea {
  id: string;
  title: string;
  salesCount: number;
  revenue: number;
  averageRating: number;
  published: boolean;
}

interface TopIdeasTableProps {
  ideas: TopIdea[];
}

export function TopIdeasTable({ ideas }: TopIdeasTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Performing Ideas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ideas.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No ideas yet. Create your first idea!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Idea</th>
                  <th className="pb-3 font-medium text-center">Sales</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                  <th className="pb-3 font-medium text-center">Rating</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea, index) => (
                  <tr key={idea.id} className="border-b last:border-0">
                    <td className="py-3">
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {index + 1}. {idea.title}
                      </Link>
                    </td>
                    <td className="py-3 text-center">{idea.salesCount}</td>
                    <td className="py-3 text-right font-medium">
                      {formatPrice(idea.revenue)}
                    </td>
                    <td className="py-3 text-center">
                      {idea.averageRating > 0 ? (
                        <span className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {idea.averageRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={idea.published ? "default" : "secondary"} className="text-xs">
                        {idea.published ? "Live" : "Draft"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
