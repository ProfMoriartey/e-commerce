import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-stone-900">Overview</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-stone-500">
              Placeholder Metric
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="border-dashed p-12 text-center text-stone-500">
          Specify the widgets and data you want to display here.
        </CardContent>
      </Card>
    </div>
  );
}
